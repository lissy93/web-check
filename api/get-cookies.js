const axios = require('axios');

exports.handler = async function(event, context) {
  const url = (event.queryStringParameters || event.query).url;

  if (!url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'url query string parameter is required' }),
    };
  }

  try {
    const response = await axios.get(url, {withCredentials: true});
    const cookies = response.headers['set-cookie'];
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
