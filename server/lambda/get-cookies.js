const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const { url } = event.queryStringParameters;

  if (!url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'url query string parameter is required' }),
    };
  }

  try {
    const response = await fetch(url);
    const cookies = response.headers.get('set-cookie');

    return {
      statusCode: 200,
      body: JSON.stringify({ cookies }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
