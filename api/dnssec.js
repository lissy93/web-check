const https = require('https');
const middleware = require('./_common/middleware'); // Make sure this path is correct

const handler = async (domain) => {
  const dnsTypes = ['DNSKEY', 'DS', 'RRSIG'];
  const records = {};

  for (const type of dnsTypes) {
    const options = {
      hostname: 'dns.google',
      path: `/resolve?name=${encodeURIComponent(domain)}&type=${type}`,
      method: 'GET',
      headers: {
        'Accept': 'application/dns-json'
      }
    };

    try {
      const dnsResponse = await new Promise((resolve, reject) => {
        const req = https.request(options, res => {
          let data = '';
          
          res.on('data', chunk => {
            data += chunk;
          });

          res.on('end', () => {
            resolve(JSON.parse(data));
          });

          res.on('error', error => {
            reject(error);
          });
        });

        req.end();
      });

      if (dnsResponse.Answer) {
        records[type] = { isFound: true, answer: dnsResponse.Answer, response: dnsResponse.Answer };
      } else {
        records[type] = { isFound: false, answer: null, response: dnsResponse };
      }
    } catch (error) {
      throw new Error(`Error fetching ${type} record: ${error.message}`); // This will be caught and handled by the commonMiddleware
    }
  }

  return records;
};

module.exports = middleware(handler);
module.exports.handler = middleware(handler);

