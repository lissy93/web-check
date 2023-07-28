const https = require('https');

exports.handler = async function (event, context) {
  const url = (event.queryStringParameters || event.query).url;

  const errorResponse = (message, statusCode = 500) => {
    return {
      statusCode: statusCode,
      body: JSON.stringify({ error: message }),
    };
  };

  if (!url) {
    return errorResponse('URL query parameter is required', 400);
  }

  try {
    const response = await new Promise((resolve, reject) => {
      const req = https.request(url, res => {

        // Check if the SSL handshake was authorized
        if (!res.socket.authorized) {
          resolve(errorResponse(`SSL handshake not authorized. Reason: ${res.socket.authorizationError}`));
        } else {
          let cert = res.socket.getPeerCertificate(true);
          if (!cert || Object.keys(cert).length === 0) {
            resolve(errorResponse("No certificate presented by the server."));
          } else {
            // omit the raw and issuerCertificate fields
            const { raw, issuerCertificate, ...certWithoutRaw } = cert;
            resolve({
              statusCode: 200,
              body: JSON.stringify(certWithoutRaw),
            });
          }
        }
      });

      req.on('error', error => {
        resolve(errorResponse(`Error fetching site certificate: ${error.message}`));
      });

      req.end();
    });

    return response;
  } catch (error) {
    return errorResponse(`Unexpected error occurred: ${error.message}`);
  }
};
