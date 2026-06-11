import { upstreamError } from './_common/upstream.js';

export const describeDnsServerLookupError = (error, domain) => {
  if (error?.code === 'ENODATA') {
    return { error: `DNS server lookup failed: no NS records were returned for ${domain}` };
  }
  if (error?.code === 'ENOTFOUND') {
    return { error: `DNS server lookup failed: ${domain} could not be resolved` };
  }
  return upstreamError(error, `DNS server lookup for ${domain}`);
};
