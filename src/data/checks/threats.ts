import type { Check } from '.';

export default {
  title: 'Malware & Phishing',
  categories: ['security', 'privacy'],
  summary: 'Whether the site appears on common malware and phishing lists',
  description:
    'Checks the domain against public malware and phishing feeds, currently URLHaus ' +
    'and PhishTank, both community-reported and updated continuously.',
  use:
    'A listing is strong evidence. An absence is weak evidence, since these feeds ' +
    'only know what somebody has reported. Freshly registered phishing domains ' +
    'routinely appear on no list at all for their first few days, which is exactly ' +
    'when they do their work.',
  resources: [
    { title: 'URLHaus', link: 'https://urlhaus-api.abuse.ch/' },
    { title: 'PhishTank', link: 'https://www.phishtank.com/' },
  ],
  screenshot: 'https://pixelflare.cc/alicia/web-check/wc-threats',
} satisfies Check;
