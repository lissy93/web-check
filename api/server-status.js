const https = require('https');
const { performance, PerformanceObserver } = require('perf_hooks');

exports.handler = async function(event, context) {
  const { url } = event.queryStringParameters;

  if (!url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'You must provide a URL query parameter!' }),
    };
  }

  let dnsLookupTime;
  let responseCode;
  let startTime;

  const obs = new PerformanceObserver((items) => {
    dnsLookupTime = items.getEntries()[0].duration;
    performance.clearMarks();
  });

  obs.observe({ entryTypes: ['measure'] });

  performance.mark('A');

  try {
    startTime = performance.now();
    const response = await new Promise((resolve, reject) => {
      const req = https.get(url, res => {
        let data = '';
        responseCode = res.statusCode;
        res.on('data', chunk => {
          data += chunk;
        });
        res.on('end', () => {
          resolve(res);
        });
      });

      req.on('error', reject);
      req.end();
    });

    if (responseCode < 200 || responseCode >= 400) {
      return {
        statusCode: 200,
        body: JSON.stringify({ error: `Received non-success response code: ${responseCode}` }),
      };
    }

    performance.mark('B');
    performance.measure('A to B', 'A', 'B');
    let responseTime = performance.now() - startTime;
    obs.disconnect();

    return {
      statusCode: 200,
      body: JSON.stringify({ isUp: true, dnsLookupTime, responseTime, responseCode }),
    };

  } catch (error) {
    obs.disconnect();
    return {
      statusCode: 200,
      body: JSON.stringify({ error: `Error during operation: ${error.message}` }),
    };
  }
};
