import middleware from './_common/middleware.js';
import { parseTarget } from './_common/parse-target.js';
import { upstreamError } from './_common/upstream.js';
import {
  HIBP_SOURCE,
  dedupeBreaches,
  fetchBreachesForDomain,
  isDifferentSite,
  parseBreaches,
  registrableDomain,
  resolveFinalDomain,
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
    // Where the browser ends up matters as much as what was typed: morele.pl
    // 301s to morele.net, and the breach is catalogued against morele.net.
    // Resolving the destination alongside the first lookup keeps it ~free.
    const [primary, destination] = await Promise.all([
      fetchBreachesForDomain(domain),
      resolveFinalDomain(url),
    ]);

    // Both domains are reported, never merged into one identity: a parked
    // domain pointing at a big site must not inherit that site's breaches
    const redirectedTo = isDifferentSite(domain, destination) ? destination : null;
    const secondary = redirectedTo
      ? await fetchBreachesForDomain(redirectedTo).catch(() => [])
      : [];

    const breaches = sortBreaches(
      dedupeBreaches([...parseBreaches(primary), ...parseBreaches(secondary)]),
    );

    return {
      domain,
      redirectedTo,
      domainsChecked: redirectedTo ? [domain, redirectedTo] : [domain],
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
