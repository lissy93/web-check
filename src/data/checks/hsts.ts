import type { Check } from '.';

export default {
  title: 'HSTS',
  categories: ['security'],
  summary: 'Whether browsers are told to only ever connect over HTTPS',
  description:
    'HSTS is a response header telling browsers to only ever contact this domain over ' +
    'HTTPS, for a stated length of time. Sites that meet the requirements can also ' +
    'submit themselves to the preload list, which ships inside browsers so even a ' +
    'first-ever request is covered.',
  use:
    'Without it, the first request a user makes is usually plain HTTP, and that ' +
    'request can be intercepted before any redirect gets a chance to run. HSTS also ' +
    'stops a user clicking through a certificate warning, which is the step most ' +
    'on-path attacks rely on.',
  resources: [
    'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security',
    'https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Strict_Transport_Security_Cheat_Sheet.html',
    'https://hstspreload.org/',
  ],
  screenshot: 'https://pixelflare.cc/alicia/web-check/wc-hsts',
} satisfies Check;
