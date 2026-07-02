import type { Analyzer } from '../types';

// Inspect negotiated protocol, forward secrecy, ALPN, OCSP stapling
const tlsConnection: Analyzer = (d) => {
  const out: ReturnType<Analyzer> = [];
  const protocol = String(d.protocol || '');

  if (/^SSLv|TLSv1(\.0)?$|TLSv1\.1/.test(protocol)) {
    out.push({
      severity: 'critical',
      title: `Outdated TLS protocol negotiated: ${protocol}`,
      detail: 'Disable TLS 1.0 and 1.1 on the server',
    });
  } else if (protocol === 'TLSv1.2') {
    out.push({ severity: 'info', title: 'TLS 1.2 in use, consider enabling TLS 1.3' });
  } else if (protocol === 'TLSv1.3') {
    out.push({ severity: 'pass', title: 'TLS 1.3 negotiated' });
  }

  if (d.forwardSecrecy === false) {
    out.push({
      severity: 'warning',
      title: 'No forward secrecy in negotiated cipher',
      detail: 'Prefer ECDHE or DHE cipher suites',
    });
  }

  if (d.ocspStapled === false) {
    out.push({
      severity: 'info',
      title: 'OCSP stapling not enabled',
      detail: 'Enable OCSP stapling to speed up cert revocation checks',
    });
  }

  if (d.alpnProtocol === 'h2') {
    out.push({ severity: 'pass', title: 'HTTP/2 negotiated via ALPN' });
  }

  return out;
};

export default tlsConnection;
