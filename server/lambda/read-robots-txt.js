const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const siteURL = event.queryStringParameters.url;
  
  if (!siteURL) {
    return {
      statusCode: 400,
      body: 'Missing URL parameter',
    };
  }

  const parsedURL = new URL(siteURL);
  const robotsURL = `${parsedURL.protocol}//${parsedURL.hostname}/robots.txt`;

  try {
    const response = await fetch(robotsURL);
    const text = await response.text();

    if (response.ok) {
      return {
        statusCode: 200,
        body: text,
      };
    } else {
      return {
        statusCode: response.status,
        body: `Failed to fetch robots.txt`,
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: `Error fetching robots.txt: ${error.toString()}`,
    };
  }
};
