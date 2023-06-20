const https = require('https');

exports.handler = async function (event, context) {
  const { url } = event.queryStringParameters;

  if (!url) {
    return {
      statusCode: 400,
      body: 'url query parameter is required',
    };
  }

  return new Promise((resolve, reject) => {
    const req = https.request(url, res => {
      resolve({
        statusCode: 200,
        body: JSON.stringify(res.socket.getPeerCertificate()),
      });
    });

    req.on('error', (error) => {
      resolve({
        statusCode: 500,
        body: `Error fetching site certificate: ${error.message}`,
      });
    });

    req.end();
  });
};
