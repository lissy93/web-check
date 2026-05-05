import { promises as dnsPromises } from 'dns';
import axios from 'axios';
import middleware from './_common/middleware.js';
import { parseTarget } from './_common/parse-target.js';
import { upstreamError } from './_common/upstream.js';

const dnsHandler = async (url) => {
  const { hostname: domain } = parseTarget(url);
  let addresses;
  try {
    addresses = await dnsPromises.resolve4(domain);
  } catch (error) {
    return upstreamError(error, 'DNS server lookup');
  }
  const results = await Promise.all(addresses.map(async (address) => {
    const hostname = await dnsPromises.reverse(address).catch(() => null);
    const dohDirectSupports = await axios
      .get(`https://${address}/dns-query`)
      .then(() => true)
      .catch(() => false);
    return { address, hostname, dohDirectSupports };
  }));
  return { domain, dns: results };
};


export const handler = middleware(dnsHandler);
export default handler;

