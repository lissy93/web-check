import type { Check } from '.';

export default {
  title: 'SSL Certificate',
  categories: ['server', 'security'],
  summary: 'Certificate issuer, validity dates and the chain of trust',
  description:
    'An SSL certificate proves a server is who it claims to be, and is what lets a ' +
    'site serve HTTPS. Certificates are issued by Certificate Authorities, who are ' +
    "meant to verify the holder's identity before signing one. The chain shows every " +
    "certificate from the site's own up to a root the browser already trusts.",
  use:
    'A certificate is public by design, so it doubles as a record: who issued it, ' +
    'when it expires, which organisation it was issued to, and often a list of other ' +
    'hostnames covered by the same cert. That last part regularly turns up subdomains ' +
    'and sister sites nobody advertised.',
  resources: [
    {
      title: 'TLS - Wiki',
      link: 'https://en.wikipedia.org/wiki/Transport_Layer_Security',
    },
    {
      title: 'What is SSL (via Cloudflare learning)',
      link: 'https://www.cloudflare.com/learning/ssl/what-is-ssl/',
    },
    { title: 'RFC-8446 - TLS', link: 'https://tools.ietf.org/html/rfc8446' },
    { title: 'SSL Checker', link: 'https://www.sslshopper.com/ssl-checker.html' },
  ],
  screenshot: 'https://pixelflare.cc/alicia/web-check/wc-ssl',
} satisfies Check;
