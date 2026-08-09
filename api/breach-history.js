import middleware from './_common/middleware.js';
import { parseTarget } from './_common/parse-target.js';
import { upstreamError } from './_common/upstream.js';
import {
  HIBP_SOURCE,
  fetchBreachesForDomain,
  parseBreaches,
  registrableDomain,
  sortBreaches,
  summariseBreaches,
} from './_common/breach-history.js';

const isIpAddress = (host) => /^\d{1,3}(\.\d{1,3}){3}$/.test(host) || host.includes(':');

// Whether the operator of this domain has appeared in a catalogued data breach.
// Only the domain is sent upstream — never an account, address or password.
const breachHistoryHandler = async (url) => {
  const { hostname } = parseTarget(url);
  if (isIpAddress(hostname)) return { skipped: 'Breach history needs a domain, not an IP' };

  const domain = registrableDomain(hostname);
  if (!domain || !domain.includes('.')) {
    return { skipped: 'Could not resolve a registrable domain to look up' };
  }

  try {
    const breaches = sortBreaches(parseBreaches(await fetchBreachesForDomain(domain)));
    return {
      domain,
      breaches,
      summary: summariseBreaches(breaches),
      source: HIBP_SOURCE,
    };
  } catch (error) {
    return upstreamError(error, 'Breach history lookup');
  }
};

export const handler = middleware(breachHistoryHandler);
export default handler;
