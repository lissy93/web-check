const https = require('https');
const urlModule = require('url');

exports.handler = async function(event, context) {
  let { url } = event.queryStringParameters;

  if (!url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'url query parameter is required' }),
    };
  }

  // Extract hostname from URL
  const parsedUrl = new URL(url);
  const domain = parsedUrl.hostname;

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
        });

        req.on('error', error => {
          reject(error);
        });

        req.end();
      });

      if (dnsResponse.Answer) {
        records[type] = { isFound: true, answer: dnsResponse.Answer, response: dnsResponse.Answer };
      } else {
        records[type] = { isFound: false, answer: null, response: dnsResponse};
      }
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: `Error fetching ${type} record: ${error.message}` }),
      };
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(records),
  };
};
