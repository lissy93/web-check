import type { Check } from '.';

export default {
  title: 'TLS Client Compatibility',
  categories: ['security'],
  summary: 'Whether Chrome, Safari, Java and older Android can still connect',
  description:
    'Replays the handshake the way a panel of real clients would perform it, covering ' +
    'Chrome, Firefox, Safari, Edge, OpenSSL, Java, iOS and Android across a spread of ' +
    'versions. For each, it reports the protocol and cipher that would be agreed, or ' +
    'that the client cannot connect at all.',
  use:
    'Tightening a TLS configuration always locks somebody out, and this shows who. ' +
    'Worth running before you drop an old protocol version, and again afterwards to ' +
    'confirm you dropped only what you meant to.',
  resources: [{ title: 'SSL Test (via SSL Labs)', link: 'https://www.ssllabs.com/ssltest/' }],
  screenshot: 'https://pixelflare.cc/alicia/web-check/wc-tls-handshake',
} satisfies Check;
