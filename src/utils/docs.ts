interface Doc {
  id: string;
  title: string;
  description: string;
  use: string;
  resources: string[];
  screenshot?: string;
}

const docs: Doc[] = [
  {
    id: "get-ip",
    title: "IP Info",
    description:
      "The IP Address task involves mapping the user provided URL to its corresponding IP address through a process known as Domain Name System (DNS) resolution. An IP address is a unique identifier given to every device on the Internet, and when paired with a domain name, it allows for accurate routing of online requests and responses.",
    use: "Identifying the IP address of a domain can be incredibly valuable for OSINT purposes. This information can aid in creating a detailed map of a target's network infrastructure, pinpointing the physical location of a server, identifying the hosting service, and even discovering other domains that are hosted on the same IP address. In cybersecurity, it's also useful for tracking the sources of attacks or malicious activities.",
    resources: [
      "https://en.wikipedia.org/wiki/IP_address",
      "https://tools.ietf.org/html/rfc791",
      "https://www.cloudflare.com/learning/dns/what-is-dns/",
      "https://www.whois.com/whois-lookup",
    ],
  },
  {
    id: "ssl",
    title: "SSL Chain",
    description:
      "The SSL task involves checking if the site has a valid Secure Sockets Layer (SSL) certificate. SSL is a protocol for establishing authenticated and encrypted links between networked computers. It's commonly used for securing communications over the internet, such as web browsing sessions, email transmissions, and more. In this task, we reach out to the server and initiate a SSL handshake. If successful, we gather details about the SSL certificate presented by the server.",
    use: "SSL certificates not only provide the assurance that data transmission to and from the website is secure, but they also provide valuable OSINT data. Information from an SSL certificate can include the issuing authority, the domain name, its validity period, and sometimes even organization details. This can be useful for verifying the authenticity of a website, understanding its security setup, or even for discovering associated subdomains or other services.",
    resources: [
      "https://en.wikipedia.org/wiki/Transport_Layer_Security",
      "https://tools.ietf.org/html/rfc8446",
      "https://letsencrypt.org/docs/",
      "https://www.sslshopper.com/ssl-checker.html",
    ],
    screenshot: 'https://i.ibb.co/kB7LsV1/wc-ssl.png',
  },
  {
    id: "dns",
    title: "DNS Records",
    description:
      "The DNS Records task involves querying the Domain Name System (DNS) for records associated with the target domain. DNS is a system that translates human-readable domain names into IP addresses that computers use to communicate. Various types of DNS records exist, including A (address), MX (mail exchange), NS (name server), CNAME (canonical name), and TXT (text), among others.",
    use: "Extracting DNS records can provide a wealth of information in an OSINT investigation. For example, A and AAAA records can disclose IP addresses associated with a domain, potentially revealing the location of servers. MX records can give clues about a domain's email provider. TXT records are often used for various administrative purposes and can sometimes inadvertently leak internal information. Understanding a domain's DNS setup can also be useful in understanding how its online infrastructure is built and managed.",
    resources: [
      "https://en.wikipedia.org/wiki/List_of_DNS_record_types",
      "https://tools.ietf.org/html/rfc1035",
      "https://mxtoolbox.com/DNSLookup.aspx",
      "https://www.dnswatch.info/",
    ],
    screenshot: 'https://i.ibb.co/7Q1kMwM/wc-dns.png',
  },
  {
    id: "cookies",
    title: "Cookies",
    description:
      "The Cookies task involves examining the HTTP cookies set by the target website. Cookies are small pieces of data stored on the user's computer by the web browser while browsing a website. They hold a modest amount of data specific to a particular client and website, such as site preferences, the state of the user's session, or tracking information.",
    use: "Cookies provide a wealth of information in an OSINT investigation. They can disclose information about how the website tracks and interacts with its users. For instance, session cookies can reveal how user sessions are managed, and tracking cookies can hint at what kind of tracking or analytics frameworks are being used. Additionally, examining cookie policies and practices can offer insights into the site's security settings and compliance with privacy regulations.",
    resources: [
      "https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies",
      "https://www.cookiepro.com/knowledge/what-is-a-cookie/",
      "https://owasp.org/www-community/controls/SecureFlag",
      "https://tools.ietf.org/html/rfc6265",
    ],
    screenshot: 'https://i.ibb.co/TTQ6DtP/wc-cookies.png',
  },
  {
    id: "robots-txt",
    title: "Crawl Rules",
    description:
      "The Crawl Rules task is focused on retrieving and interpreting the 'robots.txt' file from the target website. This text file is part of the Robots Exclusion Protocol (REP), a group of web standards that regulate how robots crawl the web, access and index content, and serve that content up to users. The file indicates which parts of the site the website owner doesn't want to be accessed by web crawler bots.",
    use: "The 'robots.txt' file can provide valuable information for an OSINT investigation. It often discloses the directories and pages that the site owner doesn't want to be indexed, potentially because they contain sensitive information. Moreover, it might reveal the existence of otherwise hidden or unlinked directories. Additionally, understanding crawl rules may offer insights into a website's SEO strategies.",
    resources: [
      "https://developers.google.com/search/docs/advanced/robots/intro",
      "https://www.robotstxt.org/robotstxt.html",
      "https://moz.com/learn/seo/robotstxt",
      "https://en.wikipedia.org/wiki/Robots_exclusion_standard",
    ],
    screenshot: 'https://i.ibb.co/KwQCjPf/wc-robots.png',
  },
  {
    id: "headers",
    title: "Headers",
    description:
      "The Headers task involves extracting and interpreting the HTTP headers sent by the target website during the request-response cycle. HTTP headers are key-value pairs sent at the start of an HTTP response, or before the actual data. Headers contain important directives for how to handle the data being transferred, including cache policies, content types, encoding, server information, security policies, and more.",
    use: "Analyzing HTTP headers can provide significant insights in an OSINT investigation. Headers can reveal specific server configurations, chosen technologies, caching directives, and various security settings. This information can help to determine a website's underlying technology stack, server-side security measures, potential vulnerabilities, and general operational practices.",
    resources: [
      "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers",
      "https://tools.ietf.org/html/rfc7231#section-3.2",
      "https://www.w3schools.com/tags/ref_httpheaders.asp",
      "https://owasp.org/www-project-secure-headers/",
    ],
    screenshot: 'https://i.ibb.co/t3xcwP1/wc-headers.png',
  },
  {
    id: "quality",
    title: "Quality Metrics",
    description:
      "The Headers task involves extracting and interpreting the HTTP headers sent by the target website during the request-response cycle. HTTP headers are key-value pairs sent at the start of an HTTP response, or before the actual data. Headers contain important directives for how to handle the data being transferred, including cache policies, content types, encoding, server information, security policies, and more.",
    use: "Analyzing HTTP headers can provide significant insights in an OSINT investigation. Headers can reveal specific server configurations, chosen technologies, caching directives, and various security settings. This information can help to determine a website's underlying technology stack, server-side security measures, potential vulnerabilities, and general operational practices.",
    resources: [
      "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers",
      "https://tools.ietf.org/html/rfc7231#section-3.2",
      "https://www.w3schools.com/tags/ref_httpheaders.asp",
      "https://owasp.org/www-project-secure-headers/",
    ],
    screenshot: 'https://i.ibb.co/Kqg8rx7/wc-quality.png',
  },
  {
    id: "location",
    title: "Server Location",
    description:
      "The Server Location task determines the physical location of a server hosting a website based on its IP address. The geolocation data typically includes the country, region, and often city where the server is located. The task also provides additional contextual information such as the official language, currency, and flag of the server's location country.",
    use: "In the realm of OSINT, server location information can be very valuable. It can give an indication of the possible jurisdiction that laws the data on the server falls under, which can be important in legal or investigative contexts. The server location can also hint at the target audience of a website and reveal inconsistencies that could suggest the use of hosting or proxy services to disguise the actual location.",
    resources: [
      "https://en.wikipedia.org/wiki/Geolocation_software",
      "https://www.iplocation.net/",
      "https://www.cloudflare.com/learning/cdn/glossary/geolocation/",
      "https://developers.google.com/maps/documentation/geolocation/intro",
    ],
    screenshot: 'https://i.ibb.co/cXH2hfR/wc-location.png',
  },
  {
    id: "hosts",
    title: "Associated Hosts",
    description:
      "This task involves identifying and listing all domains and subdomains (hostnames) that are associated with the website's primary domain. This process often involves DNS enumeration to discover any linked domains and hostnames.",
    use: "In OSINT investigations, understanding the full scope of a target's web presence is critical. Associated domains could lead to uncovering related projects, backup sites, development/test sites, or services linked to the main site. These can sometimes provide additional information or potential security vulnerabilities. A comprehensive list of associated domains and hostnames can also give an overview of the organization's structure and online footprint.",
    resources: [
      "https://en.wikipedia.org/wiki/Domain_Name_System",
      "https://resources.infosecinstitute.com/topic/dns-enumeration-pentest/",
      "https://subdomainfinder.c99.nl/",
      "https://securitytrails.com/blog/top-dns-enumeration-tools",
    ],
    screenshot: 'https://i.ibb.co/25j1sT7/wc-hosts.png',
  },
  {
    id: "redirects",
    title: "Redirect Chain",
    description:
      "This task traces the sequence of HTTP redirects that occur from the original URL to the final destination URL. An HTTP redirect is a response with a status code that advises the client to go to another URL. Redirects can occur for several reasons, such as URL normalization (directing to the www version of the site), enforcing HTTPS, URL shorteners, or forwarding users to a new site location.",
    use: "Understanding the redirect chain can be crucial for several reasons. From a security perspective, long or complicated redirect chains can be a sign of potential security risks, such as unencrypted redirects in the chain. Additionally, redirects can impact website performance and SEO, as each redirect introduces additional round-trip-time (RTT). For OSINT, understanding the redirect chain can help identify relationships between different domains or reveal the use of certain technologies or hosting providers.",
    resources: [
      "https://developer.mozilla.org/en-US/docs/Web/HTTP/Redirections",
      "https://en.wikipedia.org/wiki/URL_redirection",
      "https://www.screamingfrog.co.uk/server-response-codes/",
      "https://ahrefs.com/blog/301-redirects/",
    ],
    screenshot: 'https://i.ibb.co/hVVrmwh/wc-redirects.png',
  },
  {
    id: "txt-records",
    title: "TXT Records",
    description:
      "TXT records are a type of Domain Name Service (DNS) record that provides text information to sources outside your domain. They can be used for a variety of purposes, such as verifying domain ownership, ensuring email security, and even preventing unauthorized changes to your website.",
    use: "In the context of OSINT, TXT records can be a valuable source of information. They may reveal details about the domain's email configuration, the use of specific services like Google Workspace or Microsoft 365, or security measures in place such as SPF and DKIM. Understanding these details can give an insight into the technologies used by the organization, their email security practices, and potential vulnerabilities.",
    resources: [
      "https://www.cloudflare.com/learning/dns/dns-records/dns-txt-record/",
      "https://en.wikipedia.org/wiki/TXT_record",
      "https://tools.ietf.org/html/rfc7208",
      "https://dmarc.org/wiki/FAQ",
    ],
    screenshot: 'https://i.ibb.co/wyt21QN/wc-txt-records.png',
  },
  {
    id: "status",
    title: "Server Status",
    description:
      "TXT records are a type of Domain Name Service (DNS) record that provides text information to sources outside your domain. They can be used for a variety of purposes, such as verifying domain ownership, ensuring email security, and even preventing unauthorized changes to your website.",
    use: "In the context of OSINT, TXT records can be a valuable source of information. They may reveal details about the domain's email configuration, the use of specific services like Google Workspace or Microsoft 365, or security measures in place such as SPF and DKIM. Understanding these details can give an insight into the technologies used by the organization, their email security practices, and potential vulnerabilities.",
    resources: [
      "https://www.cloudflare.com/learning/dns/dns-records/dns-txt-record/",
      "https://en.wikipedia.org/wiki/TXT_record",
      "https://tools.ietf.org/html/rfc7208",
      "https://dmarc.org/wiki/FAQ",
    ],
    screenshot: 'https://i.ibb.co/V9CNLBK/wc-status.png',
  },
  {
    id: "ports",
    title: "Open Ports",
    description:
      "Open ports on a server are endpoints of communication which are available for establishing connections with clients. Each port corresponds to a specific service or protocol, such as HTTP (port 80), HTTPS (port 443), FTP (port 21), etc. The open ports on a server can be determined using techniques such as port scanning.",
    use: "In the context of OSINT, knowing which ports are open on a server can provide valuable information about the services running on that server. This information can be useful for understanding the potential vulnerabilities of the system, or for understanding the nature of the services the server is providing. For example, a server with port 22 open (SSH) might be used for remote administration, while a server with port 443 open is serving HTTPS traffic.",
    resources: [
      "https://www.netwrix.com/port_scanning.html",
      "https://nmap.org/book/man-port-scanning-basics.html",
      "https://www.cloudflare.com/learning/ddos/glossary/open-port/",
      "https://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers",
    ],
    screenshot: 'https://i.ibb.co/F8D1hmf/wc-ports.png',
  },
  {
    id: "trace-route",
    title: "Traceroute",
    description:
      "Traceroute is a network diagnostic tool used to track in real-time the pathway taken by a packet of information from one system to another. It records each hop along the route, providing details about the IPs of routers and the delay at each point.",
    use: "In OSINT investigations, traceroute can provide insights about the routing paths and geography of the network infrastructure supporting a website or service. This can help to identify network bottlenecks, potential censorship or manipulation of network traffic, and give an overall sense of the network's structure and efficiency. Additionally, the IP addresses collected during the traceroute may provide additional points of inquiry for further OSINT investigation.",
    resources: [
      "https://www.cloudflare.com/learning/network-layer/what-is-traceroute/",
      "https://tools.ietf.org/html/rfc1393",
      "https://en.wikipedia.org/wiki/Traceroute",
      "https://www.ripe.net/publications/docs/ripe-611",
    ],
    screenshot: 'https://i.ibb.co/M59qgxP/wc-trace-route.png',
  },
  {
    id: "carbon",
    title: "Carbon Footprint",
    description:
      "This task calculates the estimated carbon footprint of a website. It's based on the amount of data being transferred and processed, and the energy usage of the servers that host and deliver the website. The larger the website and the more complex its features, the higher its carbon footprint is likely to be.",
    use: "From an OSINT perspective, understanding a website's carbon footprint doesn't directly provide insights into its internal workings or the organization behind it. However, it can still be valuable data in broader analyses, especially in contexts where environmental impact is a consideration. For example, it can be useful for activists, researchers, or ethical hackers who are interested in the sustainability of digital infrastructure, and who want to hold organizations accountable for their environmental impact.",
    resources: [
      "https://www.websitecarbon.com/",
      "https://www.thegreenwebfoundation.org/",
      "https://www.nature.com/articles/s41598-020-76164-y",
      "https://www.sciencedirect.com/science/article/pii/S0959652620307817",
    ],
    screenshot: 'https://i.ibb.co/dmbFxjN/wc-carbon.png',
  },
  {
    id: "server-info",
    title: "Server Info",
    description:
      "This task retrieves various pieces of information about the server hosting the target website. This can include the server type (e.g., Apache, Nginx), the hosting provider, the Autonomous System Number (ASN), and more. The information is usually obtained through a combination of IP address lookups and analysis of HTTP response headers.",
    use: "In an OSINT context, server information can provide valuable clues about the organization behind a website. For instance, the choice of hosting provider could suggest the geographical region in which the organization operates, while the server type could hint at the technologies used by the organization. The ASN could also be used to find other domains hosted by the same organization.",
    resources: [
      "https://en.wikipedia.org/wiki/List_of_HTTP_header_fields",
      "https://en.wikipedia.org/wiki/Autonomous_system_(Internet)",
      "https://tools.ietf.org/html/rfc7231#section-7.4.2",
      "https://builtwith.com/",
    ],
    screenshot: 'https://i.ibb.co/Mk1jx32/wc-server.png',
  },
  {
    id: "domain",
    title: "Whois Lookup",
    description:
      "This task retrieves Whois records for the target domain. Whois records are a rich source of information, including the name and contact information of the domain registrant, the domain's creation and expiration dates, the domain's nameservers, and more. The information is usually obtained through a query to a Whois database server.",
    use: "In an OSINT context, Whois records can provide valuable clues about the entity behind a website. They can show when the domain was first registered and when it's set to expire, which could provide insights into the operational timeline of the entity. The contact information, though often redacted or anonymized, can sometimes lead to additional avenues of investigation. The nameservers could also be used to link together multiple domains owned by the same entity.",
    resources: [
      "https://en.wikipedia.org/wiki/WHOIS",
      "https://www.icann.org/resources/pages/whois-2018-01-17-en",
      "https://whois.domaintools.com/",
    ],
    screenshot: 'https://i.ibb.co/89WLp14/wc-domain.png',
  },
  {
    id: "whois",
    title: "Domain Info",
    description:
      "This task retrieves Whois records for the target domain. Whois records are a rich source of information, including the name and contact information of the domain registrant, the domain's creation and expiration dates, the domain's nameservers, and more. The information is usually obtained through a query to a Whois database server.",
    use: "In an OSINT context, Whois records can provide valuable clues about the entity behind a website. They can show when the domain was first registered and when it's set to expire, which could provide insights into the operational timeline of the entity. The contact information, though often redacted or anonymized, can sometimes lead to additional avenues of investigation. The nameservers could also be used to link together multiple domains owned by the same entity.",
    resources: [
      "https://en.wikipedia.org/wiki/WHOIS",
      "https://www.icann.org/resources/pages/whois-2018-01-17-en",
      "https://whois.domaintools.com/",
    ],
    screenshot: 'https://i.ibb.co/89WLp14/wc-domain.png',
  },
  {
    id: "dnssec",
    title: "DNS Security Extensions",
    description:
      "Without DNSSEC, it\'s possible for MITM attackers to spoof records and lead users to phishing sites. This is because the DNS system includes no built-in methods to verify that the response to the request was not forged, or that any other part of the process wasn’t interrupted by an attacker. The DNS Security Extensions (DNSSEC) secures DNS lookups by signing your DNS records using public keys, so browsers can detect if the response has been tampered with. Another solution to this issue is DoH (DNS over HTTPS) and DoT (DNS over TLD).",
    use: "DNSSEC information provides insight into an organization's level of cybersecurity maturity and potential vulnerabilities, particularly around DNS spoofing and cache poisoning. If no DNS secururity (DNSSEC, DoH, DoT, etc) is implemented, this may provide an entry point for an attacker.",
    resources: [
      "https://dnssec-analyzer.verisignlabs.com/",
      "https://www.cloudflare.com/dns/dnssec/how-dnssec-works/",
      "https://en.wikipedia.org/wiki/Domain_Name_System_Security_Extensions",
      "https://www.icann.org/resources/pages/dnssec-what-is-it-why-important-2019-03-05-en",
      "https://support.google.com/domains/answer/6147083",
      "https://www.internetsociety.org/resources/deploy360/2013/dnssec-test-sites/",
    ],
    screenshot: 'https://i.ibb.co/J54zVmQ/wc-dnssec.png',
  },
  {
    id: "features",
    title: "Site Features",
    description: 'Checks which core features are present on a site. If a feature as marked as dead, that means it\'s not being actively used at load time',
    use: "This is useful to understand what a site is capable of, and what technologies to look for",
    resources: [],
    screenshot: 'https://i.ibb.co/gP4P6kp/wc-features.png',
  },
  {
    id: "hsts",
    title: "HTTP Strict Transport Security",
    description: 'HTTP Strict Transport Security (HSTS) is a web security policy '
    +'mechanism that helps protect websites against protocol downgrade attacks and '
    + 'cookie hijacking. A website can be included in the HSTS preload list by '
    + 'conforming to a set of requirements and then submitting itself to the list.',
    use: `There are several reasons why it\'s important for a site to be HSTS enabled:
  1. User bookmarks or manually types http://example.com and is subject to a man-in-the-middle attacker
    HSTS automatically redirects HTTP requests to HTTPS for the target domain
  2. Web application that is intended to be purely HTTPS inadvertently contains HTTP links or serves content over HTTP
    HSTS automatically redirects HTTP requests to HTTPS for the target domain
  3. A man-in-the-middle attacker attempts to intercept traffic from a victim user using an invalid certificate and hopes the user will accept the bad certificate
    HSTS does not allow a user to override the invalid certificate message
    `,
    resources: [
      'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security',
      'https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Strict_Transport_Security_Cheat_Sheet.html',
      'https://hstspreload.org/'
    ],
    screenshot: 'https://i.ibb.co/k253fq4/Screenshot-from-2023-07-17-20-10-52.png',
  },
  {
    id: 'screenshot',
    title: 'Screenshot',
    description: 'This check takes a screenshot of webpage that the requested URL / IP resolves to, and displays it.',
    use: 'This may be useful to see what a given website looks like, free of the constraints of your browser, IP, or location.',
    resources: [],
  },
  {
    id: 'dns-server',
    title: 'DNS Server',
    description: 'This check determines the DNS server(s) that the requested URL / IP resolves to. Also fires off a rudimentary check to see if the DNS server supports DoH, and weather it\'s vulnerable to DNS cache poisoning.',
    use: '',
    resources: [],
  },
  {
    id: 'tech-stack',
    title: 'Tech Stack',
    description: 'Checks what technologies a site is built with.'
    + 'This is done by fetching and parsing the site, then comparing it against a bit list of RegEx maintained by Wappalyzer to identify the unique fingerprints that different technologies leave.',
    use: 'Identifying a website\'s tech stack aids in evaluating its security by exposing potential vulnerabilities, '
    + 'informs competitive analyses and development decisions, and can guide tailored marketing strategies. '
    + 'Ethical application of this knowledge is crucial to avoid harmful activities like data theft or unauthorized intrusion.',
    resources: [
      'https://builtwith.com/',
      'https://github.com/wappalyzer/wappalyzer/tree/master/src/technologies'
    ],
  },
  {
    id: 'sitemap',
    title: 'Listed Pages',
    description: 'This job finds and parses a site\'s listed sitemap. This file lists public sub-pages on the site, which the author wishes to be crawled by search engines. Sitemaps help with SEO, but are also useful for seeing all a sites public content at a glance.',
    use: 'Understand the structure of a site\'s public-facing content, and for site-owners, check that you\'re site\'s sitemap is accessible, parsable and contains everything you wish it to.',
    resources: [
      'https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview',
      'https://www.sitemaps.org/protocol.html',
      'https://www.conductor.com/academy/xml-sitemap/',
    ],
    screenshot: 'https://i.ibb.co/GtrCQYq/Screenshot-from-2023-07-21-12-28-38.png',
  },
];

export const about = [
`Web-Check is a powerful all-in-one tool for discovering information about a website/host.
The core philosophy is simple: feed Web-Check a URL and let it gather, collate, and present a broad array of open data for you to delve into.`,

`The report shines a spotlight onto potential attack vectors, existing security measures,
and the intricate web of connections within a site's architecture.
The results can also help optimizing server responses, configuring redirects,
managing cookies, or fine-tuning DNS records for your site.`,

`So, weather you're a developer, system administrator, security researcher, penetration
tester or are just interested in discovering the underlying technologies of a given site 
- I'm sure you'll find this a useful addition to your toolbox.`,

`It works using a series of lambda functions, each of which makes a crafted fetch
request to the host, processes the returned data, then responds with the results.
The web UI is just a simple React TypeScript app.`,

`There's a managed instance (hosted on Netlify), which you can use for free
(until my lambda function credits run out!), or you can easily deploy your own
instance locally or remotely.
All the code is open source, so feel free to fork and modify to your liking.
For development and deployment instructions, as well as contributing guidelines, see the GitHub repo.
`];

export const license = `The MIT License (MIT)
Copyright (c) Alicia Sykes <alicia@omg.com> 

Permission is hereby granted, free of charge, to any person obtaining a copy 
of this software and associated documentation files (the "Software"), to deal 
in the Software without restriction, including without limitation the rights 
to use, copy, modify, merge, publish, distribute, sub-license, and/or sell 
copies of the Software, and to permit persons to whom the Software is furnished 
to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included install 
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANT ABILITY, FITNESS FOR A
PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
`;

export const fairUse = [
  'Please use this tool responsibly. Do not use it for hosts you do not have permission to scan. Do not use it to attack or disrupt services.',
  'Requests are rate-limited to prevent abuse. If you need to make more bandwidth, please deploy your own instance.',
  'The hosted instance is only for demo use, as excessive use will quickly deplete my lambda function credits, making it unavailable for others and/or costing me money.',
];

export default docs;
