import type { Check } from '.';

export default {
  title: 'TLS Connection',
  categories: ['server', 'security'],
  summary: 'The version, cipher suite and details of a live TLS handshake',
  description:
    'Opens a real TLS connection to the host and reports what was actually ' +
    'negotiated: the protocol version, the cipher suite chosen, ALPN, and whether the ' +
    'certificate chain validates.',
  use:
    'Configuration files say what should happen. This says what does. It is the ' +
    'quickest way to confirm a server has genuinely stopped accepting an old ' +
    'protocol, or that a change you made has taken effect.',
  resources: [
    {
      title: 'TLS Handshakes (via Cloudflare Learning)',
      link: 'https://www.cloudflare.com/learning/ssl/what-happens-in-a-tls-handshake/',
    },
  ],
  screenshot: 'https://pixelflare.cc/alicia/web-check/wc-tls-cipher',
} satisfies Check;
