const traceroute = require('traceroute');
const url = require('url');

exports.handler = async function(event, context) {
  const urlString = (event.queryStringParameters || event.query).url;

  try {
    if (!urlString) {
      throw new Error('URL parameter is missing!');
    }

    // Parse the URL and get the hostname
    const urlObject = url.parse(urlString);
    const host = urlObject.hostname;

    if (!host) {
      throw new Error('Invalid URL provided');
    }

    // Traceroute with callback
    const result = await new Promise((resolve, reject) => {
      traceroute.trace(host, (err, hops) => {
        if (err || !hops) {
          reject(err || new Error('No hops found'));
        } else {
          resolve(hops);
        }
      });

      // Check if remaining time is less than 8.8 seconds, then reject promise
      if (context.getRemainingTimeInMillis() < 8800) {
        reject(new Error('Lambda is about to timeout'));
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Traceroute completed!",
        result,
      }),
    };
  } catch (err) {
    const message = err.code === 'ENOENT'
      ? 'Traceroute command is not installed on the host.'
      : err.message;

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: message,
      }),
    };
  }
};
