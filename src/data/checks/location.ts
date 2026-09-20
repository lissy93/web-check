import type { Check } from '.';

export default {
  title: 'Server Location',
  categories: ['server'],
  summary: 'Where in the world the server is physically hosted',
  description:
    "Maps the server's IP to a physical location using a geolocation database, which " +
    'associates address ranges with known data centres and ISPs. From the coordinates ' +
    'you also get the country, region, timezone and currency.',
  use:
    'Where a site is hosted hints at where its audience or its operator is. It also ' +
    'decides latency, and anything that turns on jurisdiction: data residency rules, ' +
    'sanctions, or whose courts a request would go through. Bear in mind this locates ' +
    'the data centre, not the company.',
  resources: [
    { title: 'IP Locator', link: 'https://geobytes.com/iplocator/' },
    {
      title: 'Internet Geolocation - Wiki',
      link: 'https://en.wikipedia.org/wiki/Internet_geolocation',
    },
  ],
  screenshot: 'https://pixelflare.cc/alicia/web-check/wc-location',
} satisfies Check;
