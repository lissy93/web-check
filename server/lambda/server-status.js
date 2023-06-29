const https = require('https');
const { performance, PerformanceObserver } = require('perf_hooks');

exports.handler = async function(event, context) {
  const { url } = event.queryStringParameters;

  if (!url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'You must provide a URL query parameter!' }),
    };
  }

  let dnsLookupTime;
  let responseCode;
  let startTime = performance.now();

  const obs = new PerformanceObserver((items) => {
    dnsLookupTime = items.getEntries()[0].duration;
    performance.clearMarks();
  });

  obs.observe({ entryTypes: ['measure'] });

  performance.mark('A');

  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      responseCode = res.statusCode;
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        performance.mark('B');
        performance.measure('A to B', 'A', 'B');
        let responseTime = performance.now() - startTime;
        obs.disconnect();
        resolve({
          statusCode: 200,
          body: JSON.stringify({ isUp: true, dnsLookupTime, responseTime, responseCode }),
        });
      });
    }).on('error', (e) => {
      resolve({
        statusCode: 500,
        body: JSON.stringify({ isUp: false, error: e.message }),
      });
    });
  });
};
