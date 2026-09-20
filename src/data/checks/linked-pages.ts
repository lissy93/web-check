import type { Check } from '.';

export default {
  title: 'Linked Pages',
  categories: ['seo'],
  summary: "Internal and external links found in the page's anchor tags",
  description:
    'Collects every link on the page from its anchor tags, separated into internal ' +
    'and external destinations.',
  use:
    'Internal links show how a site is organised, and occasionally point at pages ' +
    'nobody meant to publish. External links show who the site trusts enough to send ' +
    'visitors to, which matters for reputation and for spotting a compromise, since ' +
    'injected spam links show up here first.',
  resources: [{ title: 'W3C Link Checker', link: 'https://validator.w3.org/checklink' }],
  screenshot: 'https://pixelflare.cc/alicia/web-check/wc-links',
} satisfies Check;
