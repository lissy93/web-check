const https = require('https');
const { performance, PerformanceObserver } = require('perf_hooks');
const middleware = require('./_common/middleware');

const handler = async (url) => {
  if (!url) {
    throw new Error('You must provide a URL query parameter!');
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
      throw new Error(`Received non-success response code: ${responseCode}`);
    }

    performance.mark('B');
    performance.measure('A to B', 'A', 'B');
    let responseTime = performance.now() - startTime;
    obs.disconnect();

    return { isUp: true, dnsLookupTime, responseTime, responseCode };

  } catch (error) {
    obs.disconnect();
    throw error;
  }
};

module.exports = middleware(handler);
module.exports.handler = middleware(handler);
