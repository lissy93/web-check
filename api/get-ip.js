import dns from 'dns';
import middleware from './_common/middleware.js';

const lookupAsync = (address) => {
  return new Promise((resolve, reject) => {
    dns.lookup(address, (err, ip, family) => {
      if (err) {
        reject(err);
      } else {
        resolve({ ip, family });
      }
    });
  });
};

const ipHandler = async (url) => {
  const address = url.replaceAll('https://', '').replaceAll('http://', '');
  return await lookupAsync(address);
};


export const handler = middleware(ipHandler);
export default handler;
