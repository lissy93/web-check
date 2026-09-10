import type { Check } from '.';

export default {
  title: 'Cookies',
  categories: ['security', 'privacy'],
  summary: 'Cookies set on arrival, and how tightly each one is scoped',
  description:
    'Cookies are small pieces of data a site asks your browser to store and hand back ' +
    'on later requests. They hold session state, preferences, and very often tracking ' +
    'identifiers.',
  use:
    'What a site sets before you have interacted with it says a lot. Session cookies ' +
    'show how logins are managed, and third-party cookies name the analytics and ' +
    'advertising companies involved. The flags on each one, Secure, HttpOnly and ' +
    'SameSite, show how carefully the site handles them.',
  resources: [
    {
      title: 'HTTP Cookie Docs (Mozilla)',
      link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies',
    },
    {
      title: 'What are Cookies (via Cloudflare Learning)',
      link: 'https://www.cloudflare.com/learning/privacy/what-are-cookies/',
    },
    {
      title: 'Testing for Cookie Attributes (OWASP)',
      link: 'https://owasp.org/www-project-web-security-testing-guide/v42/4-Web_Application_Security_Testing/06-Session_Management_Testing/02-Testing_for_Cookies_Attributes',
    },
    { title: 'RFC-6265 - Cookies', link: 'https://tools.ietf.org/html/rfc6265' },
  ],
  screenshot: 'https://pixelflare.cc/alicia/web-check/wc-cookies',
} satisfies Check;
