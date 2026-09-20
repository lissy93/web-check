import type { Check } from '.';

export default {
  title: 'Whois Lookup',
  categories: ['domain'],
  summary: 'Registrar, registration dates and nameservers, from WHOIS',
  description:
    'Reads the registration record for the domain: the registrar it was bought ' +
    'through, when it was created and when it expires, the status codes currently set ' +
    'on it, and the nameservers it delegates to.',
  use:
    'Dates are the strongest signal here. A domain registered three weeks ago behaves ' +
    'very differently from one that has been renewed since 2004. Status codes show ' +
    'whether it is locked against transfer, or sitting in a grace period after ' +
    'expiry.',
  resources: [
    'https://en.wikipedia.org/wiki/WHOIS',
    'https://www.icann.org/resources/pages/whois-2018-01-17-en',
    'https://whois.domaintools.com/',
  ],
  screenshot: 'https://pixelflare.cc/alicia/web-check/wc-domain',
} satisfies Check;
