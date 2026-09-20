import type { Check } from '.';

export default {
  title: 'Crawl Rules',
  categories: ['seo'],
  summary: 'The crawl rules the site publishes for search engine bots',
  description:
    'Robots.txt sits at the root of a domain and implements the Robots Exclusion ' +
    'Protocol, telling crawlers which paths to leave alone. It stops bots from ' +
    'hammering a site, but it will not keep a page out of search results, which is ' +
    'what the noindex tag is for.',
  use:
    'Because it is a list of things the owner would rather robots did not touch, it ' +
    'occasionally names directories nothing links to: admin panels, staging paths, ' +
    'old exports. It also shows which crawlers the site treats differently from the ' +
    'rest.',
  resources: [
    {
      title: 'Google Search Docs - Robots.txt',
      link: 'https://developers.google.com/search/docs/advanced/robots/intro',
    },
    {
      title: 'Learn about robots.txt (via Moz.com)',
      link: 'https://moz.com/learn/seo/robotstxt',
    },
    {
      title: 'RFC-9309 -  Robots Exclusion Protocol',
      link: 'https://datatracker.ietf.org/doc/rfc9309/',
    },
    {
      title: 'Robots.txt - wiki',
      link: 'https://en.wikipedia.org/wiki/Robots_exclusion_standard',
    },
  ],
  screenshot: 'https://pixelflare.cc/alicia/web-check/wc-robots',
} satisfies Check;
