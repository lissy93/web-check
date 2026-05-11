import psl from 'psl';
import middleware from './_common/middleware.js';
import { httpGet } from './_common/http.js';
import { parseTarget } from './_common/parse-target.js';
import { upstreamError } from './_common/upstream.js';

const MAX_SUBDOMAINS = 500;
const HOSTNAME_RE = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/;

// Reduce a hostname to its registrable domain so we search the whole zone
const baseDomain = (host) => psl.parse(host)?.domain || host;

// Skip raw IPs, since CT logs are indexed by hostname not address
const isIpAddress = (host) => /^\d{1,3}(\.\d{1,3}){3}$/.test(host) || host.includes(':');

// Flatten crt.sh rows into a clean, deduped list of valid subdomains under the base
const collectSubdomains = (rows, base) => {
  const suffix = `.${base}`;
  const out = new Set();
  for (const row of rows) {
    const raw = row?.name_value;
    if (typeof raw !== 'string') continue;
    for (const part of raw.split('\n')) {
      const name = part.trim().toLowerCase().replace(/^\*\./, '');
      if (!name || name === base) continue;
      if (!name.endsWith(suffix)) continue;
      if (!HOSTNAME_RE.test(name)) continue;
      out.add(name);
    }
  }
  return [...out].sort();
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
  try {
    const res = await httpGet('https://crt.sh/', {
      params: { q: `%.${domain}`, output: 'json' },
      headers: { Accept: 'application/json' },
    });
    if (!Array.isArray(res.data)) {
      return { error: 'Certificate Transparency lookup returned unexpected data, please retry' };
    }
    const all = collectSubdomains(res.data, domain);
    if (!all.length) {
      return {
        skipped: `No subdomains found for ${domain} in Certificate Transparency logs`,
        retryable: true,
      };
    }
    return {
      domain,
      count: all.length,
      truncated: all.length > MAX_SUBDOMAINS,
      subdomains: all.slice(0, MAX_SUBDOMAINS),
      source: 'crt.sh',
    };
  } catch (error) {
    return upstreamError(error, 'Subdomain lookup');
  }
};

export const handler = middleware(subdomainsHandler);
export default handler;
