const tls = require('tls');
const middleware = require('./_common/middleware');

const handler = async (urlString) => {
  try {
    const parsedUrl = new URL(urlString);
    const options = {
      host: parsedUrl.hostname,
      port: parsedUrl.port || 443,
      servername: parsedUrl.hostname,
      rejectUnauthorized: false,
    };

    return new Promise((resolve, reject) => {
      const socket = tls.connect(options, () => {
        if (!socket.authorized) {
          return reject(new Error(`SSL handshake not authorized. Reason: ${socket.authorizationError}`));
        }

        const cert = socket.getPeerCertificate();
        if (!cert || Object.keys(cert).length === 0) {
          return reject(new Error(`
          No certificate presented by the server.\n
          The server is possibly not using SNI (Server Name Indication) to identify itself, and you are connecting to a hostname-aliased IP address.
          Or it may be due to an invalid SSL certificate, or an incomplete SSL handshake at the time the cert is being read.`));
        }

        const { raw, issuerCertificate, ...certWithoutRaw } = cert;
        resolve(certWithoutRaw);
        socket.end();
      });

      socket.on('error', (error) => {
        reject(new Error(`Error fetching site certificate: ${error.message}`));
      });
    });

  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = middleware(handler);
module.exports.handler = middleware(handler);
