import type { Check } from '.';

export default {
  title: 'Quality Metrics',
  categories: ['seo', 'performance'],
  summary: 'Lighthouse scores for performance, accessibility, SEO and best practice',
  description:
    'Runs Lighthouse against the page and reports its four scores: performance, ' +
    'accessibility, best practices and SEO. Each score comes with the individual ' +
    'audits behind it, so you can see exactly which checks passed and which failed.',
  use:
    "A quick read on a site's technical health. The accessibility and SEO audits in " +
    'particular tend to surface concrete, fixable problems rather than general ' +
    'advice.',
  resources: [
    { title: 'Lighthouse Docs', link: 'https://developer.chrome.com/docs/lighthouse/' },
    { title: 'Google Page Speed Tools', link: 'https://developers.google.com/speed' },
    { title: 'W3 Accessibility Tools', link: 'https://www.w3.org/WAI/test-evaluate/' },
    { title: 'Google Search Console', link: 'https://search.google.com/search-console' },
    { title: 'SEO Checker', link: 'https://www.seobility.net/en/seocheck/' },
    { title: 'PWA Builder', link: 'https://www.pwabuilder.com/' },
  ],
  screenshot: 'https://pixelflare.cc/alicia/web-check/wc-quality',
} satisfies Check;
