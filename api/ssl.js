import tls from 'tls';
import middleware from './_common/middleware.js';

const sslHandler = async (urlString) => {
  const parsedUrl = new URL(urlString);
  const options = {
    host: parsedUrl.hostname,
    port: parsedUrl.port || 443,
    servername: parsedUrl.hostname,
    rejectUnauthorized: false,
  };

  return new Promise((resolve, reject) => {
    const socket = tls.connect(options, () => {
      const cert = socket.getPeerCertificate();
      if (!cert || Object.keys(cert).length === 0) {
        reject(new Error('No certificate presented by the server'));
        socket.end();
        return;
      }
      const { raw, issuerCertificate, ...certData } = cert;
      resolve({
        ...certData,
        isValid: socket.authorized,
        authError: socket.authorizationError || null,
      });
      socket.end();
    });
    socket.on('error', (e) => {
      reject(new Error(`SSL connection failed: ${e.message}`));
    });
  });
};

export const handler = middleware(sslHandler);
export default handler;
