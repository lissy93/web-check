import type { Check } from '.';

export default {
  title: 'HTTP Security',
  categories: ['security'],
  summary: 'Protective headers such as CSP, X-Frame-Options and nosniff',
  description:
    'Checks the response headers that harden a site against browser-side attacks. ' +
    'HSTS forces HTTPS. Content-Security-Policy restricts where scripts, styles and ' +
    'other resources may load from, and is the main defence against cross-site ' +
    'scripting. X-Content-Type-Options stops browsers second-guessing a declared ' +
    'content type. X-Frame-Options controls whether the page can be embedded in a ' +
    'frame, which is what prevents clickjacking.',
  use:
    'These cost nothing to add and are very often simply absent. A site missing all ' +
    'of them is not necessarily exploitable, but it has opted out of several ' +
    'protections the browser would otherwise enforce on its behalf.',
  resources: [
    {
      title: 'OWASP Secure Headers Project',
      link: 'https://owasp.org/www-project-secure-headers/',
    },
    {
      title: 'HTTP Header Cheatsheet',
      link: 'https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html',
    },
    {
      title: 'content-security-policy.com',
      link: 'https://content-security-policy.com/',
    },
    { title: 'resourcepolicy.fyi', link: 'https://resourcepolicy.fyi/' },
    { title: 'HTTP Security Headers', link: 'https://securityheaders.com/' },
    { title: 'Mozilla Observatory', link: 'https://observatory.mozilla.org/' },
    { title: 'CSP Docs', link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP' },
    {
      title: 'HSTS Docs',
      link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security',
    },
    {
      title: 'X-Content-Type-Options Docs',
      link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options',
    },
    {
      title: 'X-Frame-Options Docs',
      link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options',
    },
    {
      title: 'X-XSS-Protection Docs',
      link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-XSS-Protection',
    },
  ],
  screenshot: 'https://pixelflare.cc/alicia/web-check/wc-http',
} satisfies Check;
