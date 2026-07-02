import psl from 'psl';
import middleware from './_common/middleware.js';
import { httpGet } from './_common/http.js';
import { parseTarget } from './_common/parse-target.js';

const MAX_SUBDOMAINS = 500;
const SOURCE_TIMEOUT = 6000;
const HOSTNAME_RE = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/;

const baseDomain = (host) => psl.parse(host)?.domain || host;
const isIpAddress = (host) => /^\d{1,3}(\.\d{1,3}){3}$/.test(host) || host.includes(':');

const certSpotter = async (domain) => {
  const token = process.env.CERTSPOTTER_TOKEN;
  const res = await httpGet('https://api.certspotter.com/v1/issuances', {
    params: { domain, include_subdomains: 'true', expand: 'dns_names' },
    headers: { Accept: 'application/json', ...(token && { Authorization: `Bearer ${token}` }) },
    timeout: SOURCE_TIMEOUT,
  });
  if (!Array.isArray(res.data)) throw new Error('certSpotter returned an unexpected response');
  return res.data.flatMap((row) => (Array.isArray(row?.dns_names) ? row.dns_names : []));
};

const crtSh = async (domain) => {
  const res = await httpGet('https://crt.sh/', {
    params: { q: `%.${domain}`, output: 'json' },
    headers: { Accept: 'application/json' },
    timeout: SOURCE_TIMEOUT,
  });
  if (!Array.isArray(res.data)) throw new Error('crt.sh returned an unexpected response');
  return res.data.flatMap((row) => String(row?.name_value ?? '').split('\n'));
};

const hackerTarget = async (domain) => {
  const res = await httpGet('https://api.hackertarget.com/hostsearch/', {
    params: { q: domain },
    timeout: SOURCE_TIMEOUT,
  });
  const body = typeof res.data === 'string' ? res.data : '';
  if (!body || /error|api count|quota/i.test(body)) throw new Error('hackerTarget unavailable');
  return body.split('\n').map((line) => line.split(',')[0]);
};

const SOURCES = [
  { name: 'certSpotter', lookup: certSpotter },
  { name: 'crt.sh', lookup: crtSh },
  { name: 'hackerTarget', lookup: hackerTarget },
];

const isTransient = (error) => {
  const status = error.response?.status;
  if (status && status < 500) return false;
  return true;
};

const subdomainsHandler = async (url) => {
  const { hostname } = parseTarget(url);
  if (isIpAddress(hostname)) {
    return { skipped: 'Subdomain enumeration only applies to domain names' };
  }
  const domain = baseDomain(hostname);
  if (!domain || !domain.includes('.')) {
    return { skipped: 'Could not resolve a registrable domain' };
  }

  const suffix = `.${domain}`;
  const sieve = (names) => [
    ...new Set(
      names
        .filter((n) => typeof n === 'string')
        .map((n) => n.trim().toLowerCase().replace(/^\*\./, ''))
        .filter((n) => n && n !== domain && n.endsWith(suffix) && HOSTNAME_RE.test(n)),
    ),
  ].sort();

  let succeeded = 0;
  const errors = [];
  for (const source of SOURCES) {
    if (source.requires && !process.env[source.requires]) continue;
    try {
      const subdomains = sieve(await source.lookup(domain));
      succeeded += 1;
      if (subdomains.length) {
        return {
          domain,
          count: subdomains.length,
          truncated: subdomains.length > MAX_SUBDOMAINS,
          subdomains: subdomains.slice(0, MAX_SUBDOMAINS),
          source: source.name,
        };
      }
    } catch (error) {
      errors.push(error);
    }
  }

  if (succeeded) {
    return { skipped: `No subdomains found for ${domain} in Certificate Transparency logs` };
  }
  return {
    error: 'Subdomain lookup is temporarily unavailable for this domain',
    retryable: errors.some(isTransient),
  };
};

export const handler = middleware(subdomainsHandler);
export default handler;
