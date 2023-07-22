const https = require('https');

exports.handler = async function (event, context) {
  const { url } = event.queryStringParameters;
  const apiKey = process.env.BUILT_WITH_API_KEY;

  const errorResponse = (message, statusCode = 500) => {
    return {
      statusCode: statusCode,
      body: JSON.stringify({ error: message }),
    };
  };

  if (!url) {
    return errorResponse('URL query parameter is required', 400);
  }

  if (!apiKey) {
    return errorResponse('Missing BuiltWith API key in environment variables', 500);
  }

  const apiUrl = `https://api.builtwith.com/free1/api.json?KEY=${apiKey}&LOOKUP=${encodeURIComponent(url)}`;

  try {
    const response = await new Promise((resolve, reject) => {
      const req = https.get(apiUrl, res => {
        let data = '';

        res.on('data', chunk => {
          data += chunk;
        });

        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode <= 299) {
            resolve(data);
          } else {
            reject(new Error(`Request failed with status code: ${res.statusCode}`));
          }
        });
      });

      req.on('error', error => {
        reject(error);
      });

      req.end();
    });

    return {
      statusCode: 200,
      body: response,
    };
  } catch (error) {
    return errorResponse(`Error making request: ${error.message}`);
  }
};
