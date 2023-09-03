const dns = require('dns');
const middleware = require('./_common/middleware');

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

const handler = async (url) => {
  const address = url.replaceAll('https://', '').replaceAll('http://', '');
  return await lookupAsync(address);
};


module.exports = middleware(handler);
module.exports.handler = middleware(handler);
