import type { Check } from '.';

export default {
  title: 'DNS Server',
  categories: ['domain'],
  summary: 'Which nameservers answer for the domain, and whether they support DoH',
  description:
    'Identifies the nameservers answering for the domain, then checks whether they ' +
    'support DNS over HTTPS and runs a rough test for resistance to cache poisoning.',
  use:
    "The nameservers tell you who runs the domain's DNS, which is often a different " +
    'company from the one hosting the site. Domains sharing an unusual set of ' +
    'nameservers are usually managed by the same people.',
  resources: [],
  screenshot: 'https://pixelflare.cc/alicia/web-check/wc-dns-servers',
} satisfies Check;
