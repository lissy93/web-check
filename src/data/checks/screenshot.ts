import type { Check } from '.';

export default {
  title: 'Screenshot',
  categories: ['seo'],
  summary: 'A full-page render of the site, as a browser sees it',
  description: 'Renders the page in a headless browser and returns the image.',
  use:
    'Shows what the site serves to a plain, logged-out visitor arriving from a ' +
    'different network. Handy when a page behaves differently for you than for ' +
    'everyone else, or when you would rather not open an untrusted site in your own ' +
    'browser.',
  resources: [],
  screenshot: 'https://pixelflare.cc/alicia/web-check/wc-screenshot',
} satisfies Check;
