import type { Check } from '.';

export default {
  title: 'Tech Stack',
  categories: ['server', 'privacy'],
  summary: 'Frameworks, analytics and services the site is built with',
  description:
    "Fetches the page and matches it against Wappalyzer's fingerprint set, a large " +
    'collection of regular expressions that recognise the traces different ' +
    'technologies leave behind in markup, headers, script paths and cookie names.',
  use:
    'Knowing the framework, CMS, analytics and payment provider narrows down which ' +
    'vulnerabilities are worth checking, and shows which third parties have a hand in ' +
    'serving the page. Detection is inference rather than certainty, and reported ' +
    'version numbers in particular are often wrong.',
  resources: [
    {
      title: 'Wappalyzer fingerprints',
      link: 'https://github.com/wappalyzer/wappalyzer/tree/master/src/technologies',
    },
    {
      title: 'BuiltWith - Check what tech a site is using',
      link: 'https://builtwith.com/',
    },
  ],
  screenshot: 'https://pixelflare.cc/alicia/web-check/wc-tech',
} satisfies Check;
