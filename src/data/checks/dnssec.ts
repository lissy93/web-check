import type { Check } from '.';

export default {
  title: 'DNSSEC',
  categories: ['security', 'domain'],
  summary: 'DNSSEC records proving DNS answers have not been tampered with',
  description:
    'Plain DNS gives a client no way to tell a genuine answer from a forged one, ' +
    'which is what makes cache poisoning and on-path spoofing possible. DNSSEC signs ' +
    'records with public-key cryptography so a resolver can verify nothing was ' +
    'altered along the way. DoH and DoT address a different half of the problem by ' +
    'encrypting the query itself.',
  use:
    'Whether a zone is signed says something about how carefully its DNS is run. An ' +
    'unsigned zone is not a vulnerability on its own, but it removes one defence ' +
    'against an attacker already in a position to interfere with resolution.',
  resources: [
    'https://dnssec-analyzer.verisignlabs.com/',
    'https://www.cloudflare.com/dns/dnssec/how-dnssec-works/',
    'https://en.wikipedia.org/wiki/Domain_Name_System_Security_Extensions',
    'https://www.icann.org/resources/pages/dnssec-what-is-it-why-important-2019-03-05-en',
    'https://support.google.com/domains/answer/6147083',
    'https://www.internetsociety.org/resources/deploy360/2013/dnssec-test-sites/',
  ],
  screenshot: 'https://pixelflare.cc/alicia/web-check/wc-dnssec',
} satisfies Check;
