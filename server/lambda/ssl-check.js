const https = require('https');
const { stringify } = require('flatted');

exports.handler = async function (event, context) {
  const { url } = event.queryStringParameters;

  const errorResponse = (message, statusCode = 444) => {
    return {
      statusCode: statusCode,
      body: JSON.stringify({ error: message }),
    };
  };

  if (!url) {
    return {
      statusCode: 400,
      body: errorResponse('url query parameter is required'),
    };
  }

  return new Promise((resolve, reject) => {
    const req = https.request(url, res => {

      // Check if the SSL handshake was authorized
      if (!res.socket.authorized) {
        resolve(errorResponse(`SSL handshake not authorized. Reason: ${res.socket.authorizationError}`));
      } else {
        const cert = res.socket.getPeerCertificate(true);
        if (!cert || Object.keys(cert).length === 0) {
          resolve(errorResponse("No certificate presented by the server."));
        } else {
          resolve({
            statusCode: 200,
            body: stringify(cert),
          });
        }
      }
    });

    req.on('error', (error) => {
      resolve(
        errorResponse(`Error fetching site certificate: ${error.message}`, 500));
    });

    req.end();
  });
};
