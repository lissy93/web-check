const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const { url } = event.queryStringParameters;

  if (!url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'url query string parameter is required' }),
    };
  }

  try {
    const response = await fetch(url);
    const headers = response.headers.raw();

    return {
      statusCode: 200,
      body: JSON.stringify(headers),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
