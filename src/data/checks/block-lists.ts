import type { Check } from '.';

export default {
  title: 'Block Detection',
  categories: ['security', 'email'],
  summary: 'Whether privacy, malware and parental-control resolvers block the site',
  description:
    'Resolves the domain through more than ten public DNS resolvers that filter ' +
    'content: ad and tracker blockers, malware filters, and family or parental ' +
    'control services. Each either returns the real address or a blocked response.',
  use:
    'Being blocked by a filtering resolver is not the same as being malicious, but it ' +
    'does mean a slice of users cannot reach the site at all. Owners rarely notice, ' +
    'because the block is invisible from the inside. Which categories of filter ' +
    'object is a rough guide to what the domain is thought to be.',
  resources: [
    {
      title: 'DNS-based Blocklists (Wikipedia)',
      link: 'https://en.wikipedia.org/wiki/DNS_blocking',
    },
  ],
  screenshot: 'https://pixelflare.cc/alicia/web-check/wc-blocks',
} satisfies Check;
