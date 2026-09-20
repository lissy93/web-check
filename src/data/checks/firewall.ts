import type { Check } from '.';

export default {
  title: 'Firewall',
  categories: ['server', 'security'],
  summary: 'Which web application firewall, if any, sits in front of the site',
  description:
    'Detects whether a web application firewall sits between the internet and the ' +
    'site, and which one. A WAF filters HTTP traffic to block common attacks such as ' +
    'SQL injection, cross-site scripting and file inclusion.',
  use:
    'A WAF changes what every other test means, since the response you get may be ' +
    'coming from the filter rather than the application behind it. Knowing the ' +
    'product also tells you the rule set in play, and WAFs have bypasses and ' +
    'vulnerabilities of their own.',
  resources: [
    {
      title: 'What is a WAF (via Cloudflare Learning)',
      link: 'https://www.cloudflare.com/learning/ddos/glossary/web-application-firewall-waf/',
    },
    {
      title: 'OWASP - Web Application Firewalls',
      link: 'https://owasp.org/www-community/Web_Application_Firewall',
    },
    {
      title: 'Web Application Firewall Best Practices',
      link: 'https://owasp.org/www-pdf-archive/Best_Practices_Guide_WAF_v104.en.pdf',
    },
    {
      title: 'WAF - Wiki',
      link: 'https://en.wikipedia.org/wiki/Web_application_firewall',
    },
  ],
  screenshot: 'https://pixelflare.cc/alicia/web-check/wc-firewall',
} satisfies Check;
