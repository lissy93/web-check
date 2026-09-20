import type { Check } from '.';

export default {
  title: 'Server Info',
  categories: ['server'],
  summary: 'Operating system, ASN and the network the host sits on',
  description:
    'Pulls together what can be learned about the machine itself: the server software ' +
    'and version, the hosting provider, the Autonomous System Number, and the ' +
    'organisation that owns the surrounding address range.',
  use:
    'The ASN is the useful part. It identifies the network operator, which tells you ' +
    'who is really hosting the site behind any reseller, and gives you a way to find ' +
    'the rest of their address space.',
  resources: [
    'https://en.wikipedia.org/wiki/List_of_HTTP_header_fields',
    'https://en.wikipedia.org/wiki/Autonomous_system_(Internet)',
    'https://tools.ietf.org/html/rfc7231#section-7.4.2',
    'https://builtwith.com/',
  ],
  screenshot: 'https://pixelflare.cc/alicia/web-check/wc-server',
} satisfies Check;
