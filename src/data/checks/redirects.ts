import type { Check } from '.';

export default {
  title: 'Redirect Chain',
  categories: ['seo', 'performance'],
  summary: 'The full chain of redirects before the final page loads',
  description:
    'Follows the sequence of HTTP redirects from the URL you entered to wherever it ' +
    'finally lands. Redirects happen for normalisation, HTTPS enforcement, link ' +
    'shorteners, and sites that have moved.',
  use:
    'Every hop costs a round trip, so long chains hurt both performance and SEO. They ' +
    'matter for security too: an unencrypted hop in the middle is a window for ' +
    'interception, and an unexpected intermediate domain can reveal a shortener, a ' +
    'tracker, or an acquisition nobody announced.',
  resources: [
    {
      title: 'HTTP Redirects - MDN',
      link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Redirections',
    },
    {
      title: 'URL Redirection - Wiki',
      link: 'https://en.wikipedia.org/wiki/URL_redirection',
    },
    { title: '301 Redirects explained', link: 'https://ahrefs.com/blog/301-redirects/' },
  ],
  screenshot: 'https://pixelflare.cc/alicia/web-check/wc-redirects',
} satisfies Check;
