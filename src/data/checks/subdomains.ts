import type { Check } from '.';

export default {
  title: 'Subdomains',
  categories: ['domain'],
  summary: 'Subdomains that have appeared in public Certificate Transparency logs',
  description:
    'Finds subdomains through public Certificate Transparency logs, via crt.sh. Every ' +
    'certificate a CA issues is logged publicly, so any hostname anyone has ever ' +
    'requested a certificate for ends up on record. The check resolves the ' +
    'registrable domain, then collects and deduplicates the names from every ' +
    'certificate issued beneath it.',
  use:
    'Subdomains are where the forgotten things live: staging servers, admin panels, ' +
    'old campaign sites, a dashboard somebody stood up for a demo and never took ' +
    'down. They tend to be maintained to a lower standard than the main site. CT logs ' +
    'are historical, though, so expect a good share of what turns up no longer to ' +
    'resolve.',
  resources: [
    { title: 'crt.sh', link: 'https://crt.sh/' },
    {
      title: 'Certificate Transparency',
      link: 'https://en.wikipedia.org/wiki/Certificate_Transparency',
    },
    { title: 'RFC-6962 (CT)', link: 'https://datatracker.ietf.org/doc/html/rfc6962' },
    {
      title: 'OWASP - Subdomain Enumeration',
      link: 'https://owasp.org/www-community/attacks/Subdomain_Takeover',
    },
  ],
} satisfies Check;
