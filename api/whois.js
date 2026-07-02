import net from 'net';
import psl from 'psl';
import { whoisDomain } from 'whoiser';
import middleware from './_common/middleware.js';
import { parseTarget } from './_common/parse-target.js';
import { createLogger } from './_common/logger.js';

const log = createLogger('whois');
const TIMEOUT = 8000;

// Walk every WHOIS/RDAP source, return the first non-empty value across the given keys
const pick = (results, ...keys) => {
  for (const src of Object.values(results)) {
    for (const key of keys) {
      const v = src?.[key];
      if (v === undefined || v === null) continue;
      if (typeof v === 'string' && !v.trim()) continue;
      if (Array.isArray(v) && !v.length) continue;
      return v;
    }
  }
  return undefined;
};

// Lower-case + dedupe nameservers, drop empty entries
const cleanNs = (ns) => {
  if (!Array.isArray(ns)) return undefined;
  const out = [...new Set(ns.map((n) => String(n).trim().toLowerCase()).filter(Boolean))];
  return out.length ? out : undefined;
};

// Convert a date string to ISO 8601 when parseable, otherwise return the raw value
const toIso = (raw) => {
  if (!raw || typeof raw !== 'string') return raw;
  const trimmed = raw.trim().replace(/\s*#.*$/, '');
  const t = Date.parse(trimmed);
  if (!Number.isNaN(t)) return new Date(t).toISOString();
  const m = trimmed.match(/^(\d{4})(\d{2})(\d{2})$/);
  if (m) return new Date(`${m[1]}-${m[2]}-${m[3]}T00:00:00Z`).toISOString();
  return raw;
};

// Reduce a hostname to its registrable domain so registry WHOIS lookups succeed
const baseDomain = (host) => psl.parse(host)?.domain || host;

// Pull the formatted-name value out of an RDAP entity vCard
const vcardFn = (vcard) => {
  if (!Array.isArray(vcard?.[1])) return undefined;
  const fn = vcard[1].find((f) => Array.isArray(f) && f[0] === 'fn');
  return fn?.[3] || undefined;
};

// Map an RDAP response into the same field names whoiser exposes, so pick() works uniformly
const rdapToWhoiserShape = (data) => {
  if (!data || data.errorCode || data.objectClassName === 'error') return null;
  const events = data.events || [];
  const evt = (a) => events.find((e) => e.eventAction === a)?.eventDate;
  const registrar = (data.entities || []).find((e) => (e.roles || []).includes('registrar'));
  const ianaId = registrar?.publicIds?.find((p) => /iana/i.test(p.type))?.identifier;
  const registrarUrlEntry = registrar?.links?.find((l) => l.rel === 'about' || l.rel === 'related');
  return {
    'Domain Name': data.ldhName,
    'Created Date': evt('registration'),
    'Updated Date': evt('last changed') || evt('last update of RDAP database'),
    'Expiry Date': evt('expiration'),
    'Registry Domain ID': data.handle,
    Registrar: vcardFn(registrar?.vcardArray),
    'Registrar IANA ID': ianaId,
    'Registrar URL': registrarUrlEntry?.href,
    'Domain Status': data.status,
    'Name Server': (data.nameservers || []).map((n) => n.ldhName).filter(Boolean),
    DNSSEC: data.secureDNS?.delegationSigned ? 'signed' : 'unsigned',
  };
};

// Last-resort lookup via rdap.org (a meta-resolver that bootstraps the right RDAP server)
const fetchRdapFallback = async (domain) => {
  try {
    const res = await fetch(`https://rdap.org/domain/${encodeURIComponent(domain)}`, {
      signal: AbortSignal.timeout(TIMEOUT),
    });
    if (!res.ok) return null;
    return rdapToWhoiserShape(await res.json());
  } catch {
    return null;
  }
};

// Whether a parsed result set has anything worth returning to the frontend
const hasUsefulData = (r) =>
  r &&
  (pick(r, 'Created Date', 'Creation Date') ||
    pick(r, 'Updated Date') ||
    pick(r, 'Expiry Date', 'Registry Expiry Date') ||
    pick(r, 'Registrar') ||
    cleanNs(pick(r, 'Name Server')));

// Resolve domain registration data via whoiser, with rdap.org as a fallback for TLD gaps
const whoisHandler = async (url) => {
  const { hostname } = parseTarget(url);
  if (net.isIP(hostname)) {
    return { skipped: 'WHOIS lookups apply to domains, not IP addresses' };
  }
  const target = baseDomain(hostname);
  let results = {};
  try {
    results = await whoisDomain(target, { follow: 2, timeout: TIMEOUT });
  } catch (error) {
    log.debug(`whoisDomain failed for ${target}: ${error.message}`);
  }
  if (!hasUsefulData(results)) {
    const rdap = await fetchRdapFallback(target);
    if (rdap) results = { ...results, 'rdap.org': rdap };
  }
  if (!hasUsefulData(results)) {
    return { skipped: 'No WHOIS data available for this domain' };
  }
  return {
    domain: pick(results, 'Domain Name') || target,
    registrar: pick(results, 'Registrar'),
    registrarUrl: pick(results, 'Registrar URL'),
    registrarIanaId: pick(results, 'Registrar IANA ID'),
    registrarWhoisServer: pick(results, 'Registrar WHOIS Server'),
    registryDomainId: pick(results, 'Registry Domain ID'),
    created: toIso(pick(results, 'Created Date', 'Creation Date')),
    updated: toIso(pick(results, 'Updated Date')),
    expires: toIso(pick(results, 'Expiry Date', 'Registry Expiry Date', 'Expiration Date')),
    nameservers: cleanNs(pick(results, 'Name Server')),
    status: pick(results, 'Domain Status'),
    dnssec: pick(results, 'DNSSEC'),
  };
};

export const handler = middleware(whoisHandler);
export default handler;
