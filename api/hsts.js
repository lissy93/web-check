const https = require('https');
const middleware = require('./_common/middleware');

const handler = async (url, event, context) => {
  const errorResponse = (message, statusCode = 500) => {
    return {
      statusCode: statusCode,
      body: JSON.stringify({ error: message }),
    };
  };
  const hstsIncompatible = (message, compatible = false, hstsHeader = null ) => {
    return { message, compatible, hstsHeader };
  };


  return new Promise((resolve, reject) => {
    const req = https.request(url, res => {
      const headers = res.headers;
      const hstsHeader = headers['strict-transport-security'];

      if (!hstsHeader) {
        resolve(hstsIncompatible(`Site does not serve any HSTS headers.`));
      } else {
        const maxAgeMatch = hstsHeader.match(/max-age=(\d+)/);
        const includesSubDomains = hstsHeader.includes('includeSubDomains');
        const preload = hstsHeader.includes('preload');

        if (!maxAgeMatch || parseInt(maxAgeMatch[1]) < 10886400) {
          resolve(hstsIncompatible(`HSTS max-age is less than 10886400.`));
        } else if (!includesSubDomains) {
          resolve(hstsIncompatible(`HSTS header does not include all subdomains.`));
        } else if (!preload) {
          resolve(hstsIncompatible(`HSTS header does not contain the preload directive.`));
        } else {
          resolve(hstsIncompatible(`Site is compatible with the HSTS preload list!`, true, hstsHeader));
        }
      }
    });

    req.on('error', (error) => {
      resolve(errorResponse(`Error making request: ${error.message}`));
    });

    req.end();
  });
};

module.exports = middleware(handler);
module.exports.handler = middleware(handler);

