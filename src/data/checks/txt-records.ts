import type { Check } from '.';

export default {
  title: 'TXT Records',
  categories: ['domain', 'email'],
  summary: 'TXT records, including domain verification and policy entries',
  description:
    'TXT records let a domain publish arbitrary text in DNS. In practice they are ' +
    'used for proving ownership of the domain to third parties, and for email ' +
    'authentication policies such as SPF and DMARC.',
  use:
    'TXT records are a running inventory of the services an organisation uses. ' +
    'Verification strings from Google Workspace, Microsoft 365, Atlassian, Zoom and ' +
    'dozens of others each carry a recognisable prefix, so the record set often names ' +
    'the internal toolchain outright.',
  resources: [
    {
      title: 'TXT Records (via Cloudflare Learning)',
      link: 'https://www.cloudflare.com/learning/dns/dns-records/dns-txt-record/',
    },
    { title: 'TXT Records - Wiki', link: 'https://en.wikipedia.org/wiki/TXT_record' },
    {
      title: 'RFC-1464 - TXT Records',
      link: 'https://datatracker.ietf.org/doc/html/rfc1464',
    },
    {
      title: 'TXT Record Lookup (via MxToolbox)',
      link: 'https://mxtoolbox.com/TXTLookup.aspx',
    },
  ],
  screenshot: 'https://pixelflare.cc/alicia/web-check/wc-txt-records',
} satisfies Check;
