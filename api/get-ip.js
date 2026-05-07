import dns from 'dns';
import middleware from './_common/middleware.js';
import { parseTarget } from './_common/parse-target.js';

const lookupAsync = (address) =>
  new Promise((resolve, reject) => {
    dns.lookup(address, (err, ip, family) => {
      if (err) reject(err);
      else resolve({ ip, family });
    });
  });

const ipHandler = async (url) => {
  const { hostname } = parseTarget(url);
  return await lookupAsync(hostname);
};

export const handler = middleware(ipHandler);
export default handler;
