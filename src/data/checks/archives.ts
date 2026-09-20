import type { Check } from '.';

export default {
  title: 'Archive History',
  categories: ['seo'],
  summary: 'How the site has changed over time, via the Wayback Machine',
  description:
    "Retrieves the capture history for the site from the Internet Archive's Wayback " +
    'Machine, showing when it was crawled and how often.',
  use:
    'The archive holds what a site used to say. Old captures turn up removed pages, ' +
    'previous owners, staff listings, prices, and copy that was quietly edited. How ' +
    'frequently a site was captured is itself a rough measure of how much attention ' +
    'it had.',
  resources: [{ title: 'Wayback Machine', link: 'https://archive.org/web/' }],
  screenshot: 'https://pixelflare.cc/alicia/web-check/wc-history',
} satisfies Check;
