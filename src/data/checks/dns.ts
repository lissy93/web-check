import type { Check } from '.';

export default {
  title: 'DNS Records',
  categories: ['domain', 'email'],
  summary: 'A, AAAA, MX, NS, CNAME and other records held for the domain',
  description:
    'DNS translates domain names into the addresses machines actually use. A domain ' +
    'publishes several record types: A and AAAA for addresses, MX for mail, NS for ' +
    'nameservers, CNAME for aliases, and TXT for arbitrary text.',
  use:
    'Address records point at the servers. MX records name the mail provider. TXT ' +
    'records tend to accumulate verification strings from every service the ' +
    'organisation has ever signed up to. Together they sketch out how the domain is ' +
    'run, and who runs parts of it.',
  resources: [
    {
      title: 'What are DNS records? (via Cloudflare learning)',
      link: 'https://www.cloudflare.com/learning/dns/dns-records/',
    },
    {
      title: 'DNS Record Types',
      link: 'https://en.wikipedia.org/wiki/List_of_DNS_record_types',
    },
    { title: 'RFC-1035 - DNS', link: 'https://tools.ietf.org/html/rfc1035' },
    {
      title: 'DNS Lookup (via MxToolbox)',
      link: 'https://mxtoolbox.com/DNSLookup.aspx',
    },
  ],
  screenshot: 'https://pixelflare.cc/alicia/web-check/wc-dns',
} satisfies Check;
