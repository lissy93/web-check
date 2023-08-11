const https = require('https');
const middleware = require('./_common/middleware');

const fetchSiteCertificateHandler = async (url) => {
  try {
    const response = await new Promise((resolve, reject) => {
      const req = https.request(url, res => {
        
        // Check if the SSL handshake was authorized
        if (!res.socket.authorized) {
          reject(new Error(`SSL handshake not authorized. Reason: ${res.socket.authorizationError}`));
        } else {
          let cert = res.socket.getPeerCertificate(true);
          if (!cert || Object.keys(cert).length === 0) {
            reject(new Error("No certificate presented by the server."));
          } else {
            // omit the raw and issuerCertificate fields
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
