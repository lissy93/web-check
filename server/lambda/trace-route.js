const traceroute = require('traceroute');
const url = require('url');

exports.handler = async function(event, context) {
  const urlString = event.queryStringParameters.url;
  const startTime = Date.now();

  try {
    if (!urlString) {

      return {
        statusCode: 400,
        body: JSON.stringify({


          error: 'URL parameter is missing!'
        }),
      };
    }

    // Parse the URL and get the hostname
    const urlObject = url.parse(urlString);
    const host = urlObject.hostname;

    if (!host) {

      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Invalid URL provided'
        }),
      };
    }

    // Traceroute with callback
    return await new Promise((resolve, reject) => {
      traceroute.trace(host, (err, hops) => {
        if (err) {
          reject(err);
        } else if (hops) {
          resolve(hops);
        }
      });
      // Check if remaining time is less than 8.8 seconds, then reject promise
      if (context.getRemainingTimeInMillis() < 8800) {
        reject(new Error('Lambda is about to timeout'));
      }
    }).then((result) => {
      const timeTaken = Date.now() - startTime;

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Traceroute completed!",
          result,
          timeTaken
        }),
      };
    }).catch((err) => {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: err.message
        }),
      };
    });


  } catch (err) {
    if (err.code === 'ENOENT') {

      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Traceroute command is not installed on the host.'
        }),
      };
    } else {

      return {
        statusCode: 500,
        body: JSON.stringify({
          error: err.message
        }),
      };
    }
  }
};
