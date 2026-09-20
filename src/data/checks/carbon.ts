import type { Check } from '.';

export default {
  title: 'Carbon Footprint',
  categories: ['seo', 'performance'],
  summary: 'Estimated CO2 from the data needed to load the page',
  description:
    'Estimates the carbon cost of loading the page from the amount of data ' +
    'transferred, and assumptions about the energy used to store, serve and deliver ' +
    'it. Heavier pages cost more.',
  use:
    "It's a proxy for page weight as much as anything, so it moves with performance. " +
    "Beyond that it's a number you can point at when arguing for a lighter site, and " +
    'one of the few externalities of web development anyone bothers to measure.',
  resources: [
    {
      title: 'WebsiteCarbon - Carbon Calculator',
      link: 'https://www.websitecarbon.com/',
    },
    {
      title: 'The Green Web Foundation',
      link: 'https://www.thegreenwebfoundation.org/',
    },
    { title: 'The Eco Friendly Web Alliance', link: 'https://ecofriendlyweb.org/' },
    { title: 'Reset.org', link: 'https://en.reset.org/' },
    {
      title: 'Your website is killing the planet - via Wired',
      link: 'https://www.wired.co.uk/article/internet-carbon-footprint',
    },
  ],
  screenshot: 'https://pixelflare.cc/alicia/web-check/wc-carbon',
} satisfies Check;
