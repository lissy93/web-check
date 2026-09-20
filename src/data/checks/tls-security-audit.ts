import type { Check } from '.';

export default {
  title: 'TLS Security Audit',
  categories: ['security'],
  summary: "SSL Labs' grade for the server's TLS configuration",
  description:
    "Summarises the target's TLS configuration from a cached SSL Labs scan: the " +
    'overall grade, supported protocol versions, forward secrecy, HSTS, and a ' +
    'checklist of historical vulnerabilities including Heartbleed, POODLE, ROBOT, ' +
    'FREAK, LOGJAM and DROWN.',
  use:
    'The grade compresses a great deal of judgement into a single letter, and the ' +
    'checklist underneath it is where the detail lives. The scan is cached, so a ' +
    'configuration change made recently may not show up yet.',
  resources: [
    { title: 'SSL Test (via SSL Labs)', link: 'https://www.ssllabs.com/ssltest/' },
    {
      title: 'SSL Labs grading guide',
      link: 'https://github.com/ssllabs/research/wiki/SSL-Server-Rating-Guide',
    },
  ],
  screenshot: 'https://pixelflare.cc/alicia/web-check/wc-tls-sec',
} satisfies Check;
