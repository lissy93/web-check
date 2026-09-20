import type { Check } from '.';

export default {
  title: 'Headers',
  categories: ['server', 'security'],
  summary: 'Every HTTP response header the server sends back',
  description:
    'HTTP headers are the key-value pairs a server sends ahead of the page itself. ' +
    'They cover caching, content type, encoding, compression, security policy, and ' +
    'whatever the server chooses to volunteer about itself.',
  use:
    'Headers are the cheapest fingerprint available. They frequently name the server ' +
    'software, the CDN, the framework and the load balancer. The security headers a ' +
    'site has left out are as informative as the ones it sets.',
  resources: [
    {
      title: 'HTTP Headers - Docs',
      link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers',
    },
    {
      title: 'RFC-7231 Section 7 - Headers',
      link: 'https://datatracker.ietf.org/doc/html/rfc7231#section-7',
    },
    {
      title: 'List of header response fields',
      link: 'https://en.wikipedia.org/wiki/List_of_HTTP_header_fields',
    },
    {
      title: 'OWASP Secure Headers Project',
      link: 'https://owasp.org/www-project-secure-headers/',
    },
  ],
  screenshot: 'https://pixelflare.cc/alicia/web-check/wc-headers',
} satisfies Check;
