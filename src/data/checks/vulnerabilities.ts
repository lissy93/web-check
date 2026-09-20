import type { Check } from '.';

export default {
  title: 'Vulnerabilities',
  categories: ['server', 'security'],
  summary: 'CVEs Shodan links to the services running on the host',
  description:
    'Lists the CVEs Shodan associates with the services it has seen on this host, ' +
    'matched from the product and version each service advertises. Every entry links ' +
    'through to its record in the National Vulnerability Database.',
  use:
    'A starting point rather than a verdict. Matching is done on banner versions, so ' +
    'expect false positives from backported patches, and do not read an empty list as ' +
    'proof that the host is clean.',
  resources: [
    'https://nvd.nist.gov/vuln',
    'https://cve.mitre.org/',
    'https://www.shodan.io/',
    'https://en.wikipedia.org/wiki/Common_Vulnerabilities_and_Exposures',
  ],
} satisfies Check;
