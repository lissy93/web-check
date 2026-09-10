export interface Category {
  label: string;
  icon: string;
  title: string;
  description: string;
  keywords: string;
  heading: [string, string, string];
  tagline: string;
  why: [string, string];
}

const all = {
  security: {
    label: 'Security',
    icon: 'shield',
    title: 'Website Security Check',
    description:
      "Check any website's TLS certificates, HTTP security headers, cookie flags, " +
      'DNSSEC, open ports and threat-list status.',
    keywords: 'website security check, ssl checker, http headers, security scanner, dnssec',
    heading: ['Website', 'security', 'check'],
    tagline:
      'Certificates, headers, cookie flags and open ports, read the way an outsider reads them.',
    why: [
      "Most of a site's security posture is public. Certificates, response headers, cookie " +
        'flags and listening ports get handed to anyone who asks, including whoever is working ' +
        "out whether you're worth the effort.",
      "None of it needs access to the site. That's rather the point: if you can see it from " +
        'here, so can everybody else.',
    ],
  },
  seo: {
    label: 'SEO',
    icon: 'search',
    title: 'Website SEO Check',
    description:
      "Check any website's crawl rules, sitemap, canonical and social tags, redirect " +
      'chains, global ranking and archived history.',
    keywords: 'seo checker, robots.txt, sitemap, open graph tags, site ranking, crawl rules',
    heading: ['Website', 'SEO', 'check'],
    tagline: 'Read a site the way a crawler does, rather than the way your browser renders it.',
    why: [
      'Crawlers see a different page than visitors do. Robots rules, canonical tags, sitemap ' +
        'entries and Open Graph markup never render on screen, so a mistake in any of them can ' +
        'sit there for months without anyone noticing.',
      'This is the layer where "it looks fine to me" stops counting as evidence.',
    ],
  },
  server: {
    label: 'Server',
    icon: 'server',
    title: 'Web Server Check',
    description:
      'Check where any website is hosted, what software it runs, which ports are open, ' +
      'and the network route packets take to reach it.',
    keywords: 'server checker, ip lookup, open ports, tech stack detection, traceroute, hosting',
    heading: ['Web', 'server', 'check'],
    tagline: "Find out who actually hosts a site, and what's running on the machine.",
    why: [
      'A domain is only the front door. Behind it is a machine somewhere physical, running an ' +
        'operating system and a web server, with some set of ports listening and a specific ' +
        'route that packets take to get there.',
      'You can work most of that out from the outside, and it usually says more about who runs ' +
        'a site than the page itself ever will.',
    ],
  },
  domain: {
    label: 'Domain',
    icon: 'globe',
    title: 'Domain & DNS Lookup',
    description:
      'Look up WHOIS registration, DNS and TXT records, nameservers, DNSSEC and ' +
      'subdomains for any domain name.',
    keywords: 'domain lookup, whois, dns records, nameservers, subdomain finder, dnssec',
    heading: ['Domain', 'name', 'lookup'],
    tagline:
      "Registration records, DNS, and every subdomain that's turned up in a public certificate.",
    why: [
      'Every domain leaves a paper trail: who registered it and when, which nameservers answer ' +
        'for it, what it publishes in TXT records, and which subdomains have appeared in public ' +
        'Certificate Transparency logs.',
      'Registration dates and shared nameservers are how you tell a fifteen-year-old business ' +
        'from something set up last Tuesday.',
    ],
  },
  email: {
    label: 'Email',
    icon: 'envelope',
    title: 'Email Configuration Check',
    description:
      "Check a domain's MX routing, SPF, DKIM and DMARC policies, TXT records, and " +
      'whether filtering resolvers block it.',
    keywords: 'email configuration check, spf, dkim, dmarc, mx records, mail blocklist',
    heading: ['Email', 'configuration', 'check'],
    tagline: 'Whether a domain can send mail that arrives, and whether anyone else can send as it.',
    why: [
      'Deliverability comes down to records the domain publishes. MX says where mail goes. SPF, ' +
        'DKIM and DMARC are how a receiving server decides a message really came from you.',
      'Get them wrong and two things happen at once: your own mail starts landing in spam, and ' +
        'forging your address becomes trivial.',
    ],
  },
  performance: {
    label: 'Performance',
    icon: 'gauge',
    title: 'Website Performance Check',
    description:
      'Measure any page with Lighthouse, and check its redirect chain, server response ' +
      'time and estimated carbon footprint.',
    keywords: 'website performance check, page speed, lighthouse, redirect chain, carbon footprint',
    heading: ['Website', 'performance', 'check'],
    tagline: 'How long a page takes to arrive, and what it costs on the way.',
    why: [
      'Speed is cumulative. Every redirect hop, every slow first byte and every oversized asset ' +
        'is paid for by the visitor, on their connection and their device rather than yours.',
      'The carbon estimate is the same numbers read a different way: bytes shipped, multiplied ' +
        'by everyone who ever loads the page.',
    ],
  },
  privacy: {
    label: 'Privacy',
    icon: 'fingerprint',
    title: 'Website Privacy Check',
    description:
      'Check the cookies a website sets on arrival, the third-party technology it ' +
      'loads, its WHOIS exposure and its threat-list status.',
    keywords: 'website privacy check, cookie checker, tracker detection, whois privacy',
    heading: ['Website', 'privacy', 'check'],
    tagline: "What a site sets, loads and passes on before you've agreed to anything.",
    why: [
      'By the time a page has finished loading, most sites have set cookies, pulled in ' +
        'third-party scripts and told several other companies that the visit happened.',
      'The domain leaks in the other direction too. WHOIS privacy is either switched on or it ' +
        "isn't, and the answer is public either way.",
    ],
  },
} satisfies Record<string, Category>;

export type CategoryId = keyof typeof all;

export const categories: Record<CategoryId, Category> = all;

export const categoryIds = Object.keys(all) as CategoryId[];

export const isCategory = (value: string): value is CategoryId =>
  (categoryIds as string[]).includes(value);
