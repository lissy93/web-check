import tls from 'tls';
import middleware from './_common/middleware.js';
import { parseTarget } from './_common/parse-target.js';

const HANDSHAKE_TIMEOUT = 4000;

const isIp = (h) => /^[\d.]+$/.test(h) || h.includes(':');

// Open one TLS handshake to the host and capture what was negotiated
const handshake = ({ hostname, port }) =>
  new Promise((resolve, reject) => {
    let ocspStapled = false;
    const socket = tls.connect({
      host: hostname,
      port: port ? Number(port) : 443,
      ...(isIp(hostname) ? {} : { servername: hostname }),
      ALPNProtocols: ['h2', 'http/1.1'],
      rejectUnauthorized: false,
      requestOCSP: true,
    });
    socket.on('OCSPResponse', (res) => {
      ocspStapled = res?.length > 0;
    });

    let settled = false;
    const finish = (fn) => (arg) => {
      if (settled) return;
      settled = true;
      fn(arg);
    };
    socket.setTimeout(HANDSHAKE_TIMEOUT);
    socket.once(
      'secureConnect',
      finish(() => {
        const cipher = socket.getCipher();
        const protocol = socket.getProtocol();
        const ephemeral =
          typeof socket.getEphemeralKeyInfo === 'function' ? socket.getEphemeralKeyInfo() : null;
        const result = {
          protocol,
          cipher: cipher && {
            name: cipher.name,
            standardName: cipher.standardName,
            version: cipher.version,
          },
          alpnProtocol: socket.alpnProtocol || null,
          sessionResumption: !!socket.getSession(),
          forwardSecrecy: protocol === 'TLSv1.3' || (!!cipher && /^(ECDHE|DHE)/.test(cipher.name)),
          authorized: socket.authorized,
          authError: socket.authorizationError ? String(socket.authorizationError) : null,
          ephemeralKey: ephemeral && {
            type: ephemeral.type || null,
            name: ephemeral.name || null,
            size: ephemeral.size || null,
          },
          ocspStapled,
        };
        socket.end();
        resolve(result);
      }),
    );
    socket.once(
      'timeout',
      finish(() => {
        socket.destroy();
        reject(new Error('TLS handshake timed-out'));
      }),
    );
    socket.once(
      'error',
      finish((err) => {
        socket.destroy();
        reject(err);
      }),
    );
  });

const tlsConnectionHandler = async (url) => {
  const { hostname, port } = parseTarget(url);
  return handshake({ hostname, port });
};

export const handler = middleware(tlsConnectionHandler);
export default handler;
