import type { Check } from '.';

export default {
  title: 'Security.txt',
  categories: ['security'],
  summary: 'The security.txt file, and who it says to contact about vulnerabilities',
  description:
    'security.txt tells researchers how to report a security problem. RFC 9116 ' +
    'defines the format: a contact address at minimum, then optionally a disclosure ' +
    'policy, a PGP key, preferred languages and an expiry date. It belongs at ' +
    '/.well-known/security.txt.',
  use:
    'Without a published contact, whoever finds a vulnerability either gives up or ' +
    'reports it somewhere public. The file is informative in its own right: a ' +
    'current, complete one suggests a team that expects reports, and the PGP key ' +
    'carries metadata of its own.',
  resources: [
    { title: 'securitytxt.org', link: 'https://securitytxt.org/' },
    {
      title: 'RFC-9116 Proposal',
      link: 'https://datatracker.ietf.org/doc/html/rfc9116',
    },
    { title: 'RFC-9116 History', link: 'https://datatracker.ietf.org/doc/rfc9116/' },
    {
      title: 'Security.txt (Wikipedia)',
      link: 'https://en.wikipedia.org/wiki/Security.txt',
    },
    {
      title: 'Example security.txt (Cloudflare)',
      link: 'https://www.cloudflare.com/.well-known/security.txt',
    },
    {
      title: 'Tutorial for creating security.txt (Pieter Bakker)',
      link: 'https://pieterbakker.com/implementing-security-txt/',
    },
  ],
  screenshot: 'https://pixelflare.cc/alicia/web-check/wc-securitytxt',
} satisfies Check;
