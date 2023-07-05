const traceroute = require('traceroute');
const util = require('util');
const url = require('url');

// Convert traceroute.trace method to return a Promise
const traceroutePromise = util.promisify(traceroute.trace);

exports.handler = async function(event, context) {
  const urlString = event.queryStringParameters.url;
  const startTime = Date.now();

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

    const result = await traceroutePromise(host);
    const timeTaken = Date.now() - startTime;
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Traceroute completed!", result, timeTaken }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: `Error: ${err.message}` }),
    };
  }
};
