const https = require('https');
const middleware = require('./_common/middleware');
const urlModule = require('url');

const fetchSiteCertificateHandler = async (urlString) => {
  try {
    const parsedUrl = urlModule.parse(urlString);
    const options = {
      host: parsedUrl.hostname,
      port: parsedUrl.port || 443, // Default port for HTTPS
      method: 'GET',
      servername: parsedUrl.hostname, // For SNI
      rejectUnauthorized: false // Disable strict SSL verification (use with caution)
    };

    const response = await new Promise((resolve, reject) => {
      const req = https.request(options, res => {
        
        // Check if the SSL handshake was authorized
        if (!res.socket.authorized) {
          reject(new Error(`SSL handshake not authorized. Reason: ${res.socket.authorizationError}`));
        } else {
          let cert = res.socket.getPeerCertificate(true);
          if (!cert || Object.keys(cert).length === 0) {
            reject(new Error("No certificate presented by the server."));
          } else {
            const { raw, issuerCertificate, ...certWithoutRaw } = cert;
            resolve(certWithoutRaw);
          }
        }
      });

      req.on('error', error => {
        reject(new Error(`Error fetching site certificate: ${error.message}`));
      });

      req.end();
    });

    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.handler = middleware(fetchSiteCertificateHandler);
