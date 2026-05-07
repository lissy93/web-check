import { promises as dnsPromises } from 'dns';
import middleware from './_common/middleware.js';
import { parseTarget } from './_common/parse-target.js';
import { upstreamError } from './_common/upstream.js';

// Resolve a nameserver hostname to its IP addresses
const resolveNs = async (ns) => {
  try {
    return (await dnsPromises.resolve4(ns))[0];
  } catch {
    return null;
  }
};

const dnsHandler = async (url) => {
  const { hostname: domain } = parseTarget(url);
  let nameservers;
  try {
    nameservers = await dnsPromises.resolveNs(domain);
  } catch (error) {
    return upstreamError(error, 'DNS server lookup');
  }
  const results = await Promise.all(
    nameservers.map(async (ns) => {
      const ip = await resolveNs(ns);
      return { address: ip, hostname: ns };
    }),
  );
  return { domain, dns: results };
};

export const handler = middleware(dnsHandler);
export default handler;
