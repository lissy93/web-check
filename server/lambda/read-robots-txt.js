const axios = require('axios');

exports.handler = async function(event, context) {
  const siteURL = event.queryStringParameters.url;

  if (!siteURL) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing url query parameter' }),
    };
  }

  let parsedURL;
  try {
    parsedURL = new URL(siteURL);
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid url query parameter' }),
    };
  }

  const robotsURL = `${parsedURL.protocol}//${parsedURL.hostname}/robots.txt`;

  try {
    const response = await axios.get(robotsURL);

    if (response.status === 200) {
      return {
        statusCode: 200,
        body: response.data,
      };
    } else {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Failed to fetch robots.txt', statusCode: response.status }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Error fetching robots.txt: ${error.message}` }),
    };
  }
};
