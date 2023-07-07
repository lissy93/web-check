const https = require('https');

exports.handler = async function (event, context) {
  const { url } = event.queryStringParameters;
  const apiKey = process.env.BUILT_WITH_API_KEY;

  const errorResponse = (message, statusCode = 444) => {
    return {
      statusCode: statusCode,
      body: JSON.stringify({ error: message }),
    };
  };

  if (!url) {
    return errorResponse('url query parameter is required', 400);
  }

  const apiUrl = `https://api.builtwith.com/free1/api.json?KEY=${apiKey}&LOOKUP=${encodeURIComponent(url)}`;

  return new Promise((resolve, reject) => {
    https.get(apiUrl, (res) => {
      let data = '';

      // A chunk of data has been received.
      res.on('data', (chunk) => {
        data += chunk;
      });

      // The whole response has been received.
      res.on('end', () => {
        if(res.statusCode !== 200){
          resolve(errorResponse(`Request failed with status code: ${res.statusCode}`));
        } else {
          resolve({
            statusCode: 200,
            body: data,
          });
        }
      });
    }).on('error', (err) => {
      resolve(errorResponse(`Error making request: ${err.message}`, 500));
    });
  });
};
