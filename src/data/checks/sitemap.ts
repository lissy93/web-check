import type { Check } from '.';

export default {
  title: 'Sitemap',
  categories: ['seo'],
  summary: 'The pages a site lists in its own sitemap',
  description:
    "Finds and parses the site's sitemap, the file where an author lists the pages " +
    'they want search engines to crawl, usually with a last-modified date and a ' +
    'priority against each one.',
  use:
    "It is the site's own table of contents. Owners can use it to confirm the sitemap " +
    'is reachable, parsable and lists what it should. Everyone else gets the shape of ' +
    'a site without having to crawl it.',
  resources: [
    {
      title: 'Learn about Sitemaps',
      link: 'https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview',
    },
    { title: 'Sitemap XML spec', link: 'https://www.sitemaps.org/protocol.html' },
    {
      title: 'Sitemap tutorial',
      link: 'https://www.conductor.com/academy/xml-sitemap/',
    },
  ],
  screenshot: 'https://pixelflare.cc/alicia/web-check/wc-pages',
} satisfies Check;
