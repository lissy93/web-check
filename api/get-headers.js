const axios = require('axios');

exports.handler = async function(event, context) {
  const url = (event.queryStringParameters || event.query).url;

  if (!url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'url query string parameter is required' }),
    };
  }

  try {
    const response = await axios.get(url, {
      validateStatus: function (status) {
        return status >= 200 && status < 600; // Resolve only if the status code is less than 600
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify(response.headers),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
