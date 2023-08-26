export interface Doc {
  id: string;
  title: string;
  description: string;
  use: string;
  resources: string[] | { title: string, link: string}[];
  screenshot?: string;
}

const docs: Doc[] = [
  {
    id: "get-ip",
    title: "IP Info",
    description:
      "An IP address (Internet Protocol address) is a numerical label assigned to each device connected to a network / the internet. The IP associated with a given domain can be found by querying the Domain Name System (DNS) for the domain's A (address) record.",
    use: "Finding the IP of a given server is the first step to conducting further investigations, as it allows us to probe the server for additional info. Including creating a detailed map of a target's network infrastructure, pinpointing the physical location of a server, identifying the hosting service, and even discovering other domains that are hosted on the same IP address.",
    resources: [
      { title: 'Understanding IP Addresses', link: 'https://www.digitalocean.com/community/tutorials/understanding-ip-addresses-subnets-and-cidr-notation-for-networking'},
      { title: 'IP Addresses - Wiki', link: 'https://en.wikipedia.org/wiki/IP_address'},
      { title: 'RFC-791 Internet Protocol', link: 'https://tools.ietf.org/html/rfc791'},
      { title: 'whatismyipaddress.com', link: 'https://whatismyipaddress.com/'},
    ],
  },
  {
    id: "ssl",
    title: "SSL Chain",
    description:
    "SSL certificates are digital certificates that authenticate the identity of a website or server, enable secure encrypted communication (HTTPS), and establish trust between clients and servers. A valid SSL certificate is required for a website to be able to use the HTTPS protocol, and encrypt user + site data in transit. SSL certificates are issued by Certificate Authorities (CAs), which are trusted third parties that verify the identity and legitimacy of the certificate holder.",  
    use: "SSL certificates not only provide the assurance that data transmission to and from the website is secure, but they also provide valuable OSINT data. Information from an SSL certificate can include the issuing authority, the domain name, its validity period, and sometimes even organization details. This can be useful for verifying the authenticity of a website, understanding its security setup, or even for discovering associated subdomains or other services.",
    resources: [
      { title: 'TLS - Wiki', link: 'https://en.wikipedia.org/wiki/Transport_Layer_Security'},
      { title: 'What is SSL (via Cloudflare learning)', link: 'https://www.cloudflare.com/learning/ssl/what-is-ssl/'},
      { title: 'RFC-8446 - TLS', link: 'https://tools.ietf.org/html/rfc8446'},
      { title: 'SSL Checker', link: 'https://www.sslshopper.com/ssl-checker.html'},
    ],
    screenshot: 'https://i.ibb.co/kB7LsV1/wc-ssl.png',
  },
  {
    id: "dns",
    title: "DNS Records",
    description:
      "This task involves looking up the DNS records associated with a specific domain. DNS is a system that translates human-readable domain names into IP addresses that computers use to communicate. Various types of DNS records exist, including A (address), MX (mail exchange), NS (name server), CNAME (canonical name), and TXT (text), among others.",
    use: "Extracting DNS records can provide a wealth of information in an OSINT investigation. For example, A and AAAA records can disclose IP addresses associated with a domain, potentially revealing the location of servers. MX records can give clues about a domain's email provider. TXT records are often used for various administrative purposes and can sometimes inadvertently leak internal information. Understanding a domain's DNS setup can also be useful in understanding how its online infrastructure is built and managed.",
    resources: [
      { title: 'What are DNS records? (via Cloudflare learning)', link: 'https://www.cloudflare.com/learning/dns/dns-records/'},
      { title: 'DNS Record Types', link: 'https://en.wikipedia.org/wiki/List_of_DNS_record_types'},
      { title: 'RFC-1035 - DNS', link: 'https://tools.ietf.org/html/rfc1035'},
      { title: 'DNS Lookup (via MxToolbox)', link: 'https://mxtoolbox.com/DNSLookup.aspx'},
    ],
    screenshot: 'https://i.ibb.co/7Q1kMwM/wc-dns.png',
  },
  {
    id: "cookies",
    title: "Cookies",
    description:
      "The Cookies task involves examining the HTTP cookies set by the target website. Cookies are small pieces of data stored on the user's computer by the web browser while browsing a website. They hold a modest amount of data specific to a particular client and website, such as site preferences, the state of the user's session, or tracking information.",
    use: "Cookies can disclose information about how the website tracks and interacts with its users. For instance, session cookies can reveal how user sessions are managed, and tracking cookies can hint at what kind of tracking or analytics frameworks are being used. Additionally, examining cookie policies and practices can offer insights into the site's security settings and compliance with privacy regulations.",
    resources: [
      { title: 'HTTP Cookie Docs (Mozilla)', link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies' },
      { title: 'What are Cookies (via Cloudflare Learning)', link: 'https://www.cloudflare.com/learning/privacy/what-are-cookies/' },
      { title: 'Testing for Cookie Attributes (OWASP)', link: 'https://owasp.org/www-project-web-security-testing-guide/v42/4-Web_Application_Security_Testing/06-Session_Management_Testing/02-Testing_for_Cookies_Attributes' },
      { title: 'RFC-6265 - Coolies', link: 'https://tools.ietf.org/html/rfc6265' },
    ],
    screenshot: 'https://i.ibb.co/TTQ6DtP/wc-cookies.png',
  },
  {
    id: "robots-txt",
    title: "Crawl Rules",
    description:
      "Robots.txt is a file found (usually) at the root of a domain, and is used to implement the Robots Exclusion Protocol (REP) to indicate which pages should be ignored by which crawlers and bots. It's good practice to avoid search engine crawlers from over-loading your site, but should not be used to keep pages out of search results (use the noindex meta tag or header instead).",
    use: "It's often useful to check the robots.txt file during an investigation, as it can sometimes disclose the directories and pages that the site owner doesn't want to be indexed, potentially because they contain sensitive information, or reveal the existence of otherwise hidden or unlinked directories. Additionally, understanding crawl rules may offer insights into a website's SEO strategies.",
    resources: [
      { title: 'Google Search Docs - Robots.txt', link: 'https://developers.google.com/search/docs/advanced/robots/intro' },
      { title: 'Learn about robots.txt (via Moz.com)', link: 'https://moz.com/learn/seo/robotstxt' },
      { title: 'RFC-9309 -  Robots Exclusion Protocol', link: 'https://datatracker.ietf.org/doc/rfc9309/' },
      { title: 'Robots.txt - wiki', link: 'https://en.wikipedia.org/wiki/Robots_exclusion_standard' },
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
      { title: 'HTTP Headers - Docs', link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers' },
      { title: 'RFC-7231 Section 7 - Headers', link: 'https://datatracker.ietf.org/doc/html/rfc7231#section-7' },
      { title: 'List of header response fields', link: 'https://en.wikipedia.org/wiki/List_of_HTTP_header_fields' },
      { title: 'OWASP Secure Headers Project', link: 'https://owasp.org/www-project-secure-headers/' },
    ],
    screenshot: 'https://i.ibb.co/t3xcwP1/wc-headers.png',
  },
  {
    id: "quality",
    title: "Quality Metrics",
    description:
      "Using Lighthouse, the Quality Metrics task measures the performance, accessibility, best practices, and SEO of the target website. This returns a simple checklist of 100 core metrics, along with a score for each category, to gauge the overall quality of a given site.",
    use: "Useful for assessing a site's technical health, SEO issues, identify vulnerabilities, and ensure compliance with standards.",
    resources: [
      { title: 'Lighthouse Docs', link: 'https://developer.chrome.com/docs/lighthouse/' },
      { title: 'Google Page Speed Tools', link: 'https://developers.google.com/speed' },
      { title: 'W3 Accessibility Tools', link: 'https://www.w3.org/WAI/test-evaluate/' },
      { title: 'Google Search Console', link: 'https://search.google.com/search-console' },
      { title: 'SEO Checker', link: 'https://www.seobility.net/en/seocheck/' },
      { title: 'PWA Builder', link: 'https://www.pwabuilder.com/' },
    ],
    screenshot: 'https://i.ibb.co/Kqg8rx7/wc-quality.png',
  },
  {
    id: "location",
    title: "Server Location",
    description:
      "The Server Location task determines the physical location of the server hosting a given website based on its IP address. This is done by looking up the IP in a location database, which maps the IP to a lat + long of known data centers and ISPs. From the latitude and longitude, it's then possible to show additional contextual info, like a pin on the map, along with address, flag, time zone, currency, etc.",
    use: "Knowing the server location is a good first step in better understanding a website. For site owners this aids in optimizing content delivery, ensuring compliance with data residency requirements, and identifying potential latency issues that may impact user experience in specific geographical regions. And for security researcher, assess the risk posed by specific regions or jurisdictions regarding cyber threats and regulations.",
    resources: [
      { title: 'IP Locator', link: 'https://geobytes.com/iplocator/' },
      { title: 'Internet Geolocation - Wiki', link: 'https://en.wikipedia.org/wiki/Internet_geolocation' },
    ],
    screenshot: 'https://i.ibb.co/cXH2hfR/wc-location.png',
  },
  {
    id: "hosts",
    title: "Associated Hosts",
    description:
      "This task involves identifying and listing all domains and subdomains (hostnames) that are associated with the website's primary domain. This process often involves DNS enumeration to discover any linked domains and hostnames, as well as looking at known DNS records.",
    use: "During an investigation, understanding the full scope of a target's web presence is critical. Associated domains could lead to uncovering related projects, backup sites, development/test sites, or services linked to the main site. These can sometimes provide additional information or potential security vulnerabilities. A comprehensive list of associated domains and hostnames can also give an overview of the organization's structure and online footprint.",
    resources: [
      { title: 'DNS Enumeration - Wiki', link: 'https://en.wikipedia.org/wiki/DNS_enumeration' },
      { title: 'OWASP - Enumerate Applications on Webserver', link: 'https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/01-Information_Gathering/04-Enumerate_Applications_on_Webserver' },
      { title: 'DNS Enumeration - DNS Dumpster', link: 'https://dnsdumpster.com/' },
      { title: 'Subdomain Finder', link: 'https://subdomainfinder.c99.nl/' },
    ],
    screenshot: 'https://i.ibb.co/25j1sT7/wc-hosts.png',
  },
  {
    id: "redirects",
    title: "Redirect Chain",
    description:
      "This task traces the sequence of HTTP redirects that occur from the original URL to the final destination URL. An HTTP redirect is a response with a status code that advises the client to go to another URL. Redirects can occur for several reasons, such as URL normalization (directing to the www version of the site), enforcing HTTPS, URL shorteners, or forwarding users to a new site location.",
    use: "Understanding the redirect chain can be useful for several reasons. From a security perspective, long or complicated redirect chains can be a sign of potential security risks, such as unencrypted redirects in the chain. Additionally, redirects can impact website performance and SEO, as each redirect introduces additional round-trip-time (RTT). For OSINT, understanding the redirect chain can help identify relationships between different domains or reveal the use of certain technologies or hosting providers.",
    resources: [
      { title: 'HTTP Redirects - MDN', link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Redirections' },
      { title: 'URL Redirection - Wiki', link: 'https://en.wikipedia.org/wiki/URL_redirection' },
      { title: '301 Redirects explained', link: 'https://ahrefs.com/blog/301-redirects/' },
    ],
    screenshot: 'https://i.ibb.co/hVVrmwh/wc-redirects.png',
  },
  {
    id: "txt-records",
    title: "TXT Records",
    description:
      "TXT records are a type of DNS record that provides text information to sources outside your domain. They can be used for a variety of purposes, such as verifying domain ownership, ensuring email security, and even preventing unauthorized changes to your website.",
    use: "The TXT records often reveal which external services and technologies are being used with a given domain. They may reveal details about the domain's email configuration, the use of specific services like Google Workspace or Microsoft 365, or security measures in place such as SPF and DKIM. Understanding these details can give an insight into the technologies used by the organization, their email security practices, and potential vulnerabilities.",
    resources: [
      { title: 'TXT Records (via Cloudflare Learning)', link: 'https://www.cloudflare.com/learning/dns/dns-records/dns-txt-record/' },
      { title: 'TXT Records - Wiki', link: 'https://en.wikipedia.org/wiki/TXT_record' },
      { title: 'RFC-1464 - TXT Records', link: 'https://datatracker.ietf.org/doc/html/rfc1464' },
      { title: 'TXT Record Lookup (via MxToolbox)', link: 'https://mxtoolbox.com/TXTLookup.aspx' },
    ],
    screenshot: 'https://i.ibb.co/wyt21QN/wc-txt-records.png',
  },
  {
    id: "status",
    title: "Server Status",
    description: "Checks if a server is online and responding to requests.",
    use: "",
    resources: [
    ],
    screenshot: 'https://i.ibb.co/V9CNLBK/wc-status.png',
  },
  {
    id: "ports",
    title: "Open Ports",
    description:
      "Open ports on a server are endpoints of communication which are available for establishing connections with clients. Each port corresponds to a specific service or protocol, such as HTTP (port 80), HTTPS (port 443), FTP (port 21), etc. The open ports on a server can be determined using techniques such as port scanning.",
    use: "Knowing which ports are open on a server can provide information about the services running on that server, useful for understanding the potential vulnerabilities of the system, or for understanding the nature of the services the server is providing.",
    resources: [
      { title: 'List of TCP & UDP Port Numbers', link: 'https://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers' },
      { title: 'NMAP - Port Scanning Basics', link: 'https://nmap.org/book/man-port-scanning-basics.html' },
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
      { title: 'WebsiteCarbon - Carbon Calculator', link: 'https://www.websitecarbon.com/' },
      { title: 'The Green Web Foundation', link: 'https://www.thegreenwebfoundation.org/' },
      { title: 'The Eco Friendly Web Alliance', link: 'https://ecofriendlyweb.org/' },
      { title: 'Reset.org', link: 'https://en.reset.org/' },
      { title: 'Your website is killing the planet - via Wired', link: 'https://www.wired.co.uk/article/internet-carbon-footprint' },
    ],
    screenshot: 'https://i.ibb.co/5v6fSyw/Screenshot-from-2023-07-29-19-07-50.png',
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
      "Without DNSSEC, it's possible for MITM attackers to spoof records and lead users to phishing sites. This is because the DNS system includes no built-in methods to verify that the response to the request was not forged, or that any other part of the process wasn’t interrupted by an attacker. The DNS Security Extensions (DNSSEC) secures DNS lookups by signing your DNS records using public keys, so browsers can detect if the response has been tampered with. Another solution to this issue is DoH (DNS over HTTPS) and DoT (DNS over TLD).",
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
    use: `There are several reasons why it's important for a site to be HSTS enabled:
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
    id: 'dns-server',
    title: 'DNS Server',
    description: 'This check determines the DNS server(s) that the requested URL / IP resolves to. Also fires off a rudimentary check to see if the DNS server supports DoH, and weather it\'s vulnerable to DNS cache poisoning.',
    use: '',
    resources: [],
    screenshot: 'https://i.ibb.co/tKpL8F9/Screenshot-from-2023-08-12-15-43-12.png',
  },
  {
    id: 'tech-stack',
    title: 'Tech Stack',
    description: 'Checks what technologies a site is built with. '
    + 'This is done by fetching and parsing the site, then comparing it against a bit list of RegEx maintained by Wappalyzer to identify the unique fingerprints that different technologies leave.',
    use: 'Identifying a website\'s tech stack aids in evaluating its security by exposing potential vulnerabilities, '
    + 'informs competitive analyses and development decisions, and can guide tailored marketing strategies. '
    + 'Ethical application of this knowledge is crucial to avoid harmful activities like data theft or unauthorized intrusion.',
    resources: [
      { title: 'Wappalyzer fingerprints', link: 'https://github.com/wappalyzer/wappalyzer/tree/master/src/technologies'},
      { title: 'BuiltWith - Check what tech a site is using', link: 'https://builtwith.com/'},
    ],
    screenshot: 'https://i.ibb.co/bBQSQNz/Screenshot-from-2023-08-12-15-43-46.png',
  },
  {
    id: 'sitemap',
    title: 'Listed Pages',
    description: 'This job finds and parses a site\'s listed sitemap. This file lists public sub-pages on the site, which the author wishes to be crawled by search engines. Sitemaps help with SEO, but are also useful for seeing all a sites public content at a glance.',
    use: 'Understand the structure of a site\'s public-facing content, and for site-owners, check that you\'re site\'s sitemap is accessible, parsable and contains everything you wish it to.',
    resources: [
      { title: 'Learn about Sitemaps', link: 'https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview'},
      { title: 'Sitemap XML spec', link: 'https://www.sitemaps.org/protocol.html'},
      { title: 'Sitemap tutorial', link: 'https://www.conductor.com/academy/xml-sitemap/'},
    ],
    screenshot: 'https://i.ibb.co/GtrCQYq/Screenshot-from-2023-07-21-12-28-38.png',
  },
  {
    id: 'security-txt',
    title: 'Security.txt',
    description: "The security.txt file tells researchers how they can responsibly disclose any security issues found on your site. "
    + "The standard was proposed in RFC 9116, and specifies that this file should include a point of contact (email address), "
    + "as well as optionally other info, like a link to the security disclosure policy, PGP key, proffered language, policy expiry and more. "
    + "The file should be located at the root of your domain, either at /security.txt or /.well-known/security.txt.",
    use: "This is important, as without a defined point of contact a security researcher may be unable to report a critical security issue, "
    + "or may use insecure or possibly public channels to do so. From an OSINT perspective, you may also glean info about a site including "
    + "their posture on security, their CSAF provider, and meta data from the PGP public key.",
    resources: [
      { title: 'securitytxt.org', link: 'https://securitytxt.org/'},
      { title: 'RFC-9116 Proposal', link: 'https://datatracker.ietf.org/doc/html/rfc9116'},
      { title: 'RFC-9116 History', link: 'https://datatracker.ietf.org/doc/rfc9116/'},
      { title: 'Security.txt (Wikipedia)', link: 'https://en.wikipedia.org/wiki/Security.txt'},
      { title: 'Example security.txt (Cloudflare)', link: 'https://www.cloudflare.com/.well-known/security.txt'},
      { title: 'Tutorial for creating security.txt (Pieter Bakker)', link: 'https://pieterbakker.com/implementing-security-txt/'},
    ],
    screenshot: 'https://i.ibb.co/tq1FT5r/Screenshot-from-2023-07-24-20-31-21.png',
  },
  {
    id: 'linked-pages',
    title: 'Linked Pages',
    description: 'Displays all internal and external links found on a site, identified by the href attributes attached to anchor elements.',
    use: "For site owners, this is useful for diagnosing SEO issues, improving the site structure, understanding how content is inter-connected. External links can show partnerships, dependencies, and potential reputation risks. " +
    "From a security standpoint, the outbound links can help identify any potential malicious or compromised sites the website is unknowingly linking to. Analyzing internal links can aid in understanding the site's structure and potentially uncover hidden or vulnerable pages which are not intended to be public. " +
    "And for an OSINT investigator, it can aid in building a comprehensive understanding of the target, uncovering related entities, resources, or even potential hidden parts of the site.",
    resources: [
      { title: 'W3C Link Checker', link: 'https://validator.w3.org/checklink'},
    ],
    screenshot: 'https://i.ibb.co/LtK14XR/Screenshot-from-2023-07-29-11-16-44.png',
  },
  {
    id: 'social-tags',
    title: 'Social Tags',
    description: 'Websites can include certain meta tags, that tell search engines and social media platforms what info to display. This usually includes a title, description, thumbnail, keywords, author, social accounts, etc.',
    use: 'Adding this data to your site will boost SEO, and as an OSINT researcher it can be useful to understand how a given web app describes itself',
    resources: [
      { title: 'SocialSharePreview.com', link: 'https://socialsharepreview.com/'},
      { title: 'The guide to social meta tags', link: 'https://css-tricks.com/essential-meta-tags-social-media/'},
      { title: 'Web.dev metadata tags', link: 'https://web.dev/learn/html/metadata/'},
      { title: 'Open Graph Protocol', link: 'https://ogp.me/'},
      { title: 'Twitter Cards', link: 'https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards'},
      { title: 'Facebook Open Graph', link: 'https://developers.facebook.com/docs/sharing/webmasters'},
    ],
    screenshot: 'https://i.ibb.co/4srTT1w/Screenshot-from-2023-07-29-11-15-27.png',
  },
  {
    id: 'mail-config',
    title: 'Email Configuration',
    description: "DMARC (Domain-based Message Authentication, Reporting & Conformance): DMARC is an email authentication protocol that works with SPF and DKIM to prevent email spoofing and phishing. It allows domain owners to specify how to handle unauthenticated mail via a published policy in DNS, and provides a way for receiving mail servers to send feedback about emails' compliance to the sender. " +
    "BIMI (Brand Indicators for Message Identification): BIMI is an emerging email standard that enables organizations to display a logo in their customers' email clients automatically. BIMI ties the logo to the domain's DMARC record, providing another level of visual assurance to recipients that the email is legitimate. " +
    "DKIM (DomainKeys Identified Mail): DKIM is an email security standard designed to make sure that messages were not altered in transit between the sending and recipient servers. It uses digital signatures linked to the domain of the sender to verify the sender and ensure message integrity. " +
    "SPF (Sender Policy Framework): SPF is an email authentication method designed to prevent email spoofing. It specifies which mail servers are authorized to send email on behalf of a domain by creating a DNS record. This helps protect against spam by providing a way for receiving mail servers to check that incoming mail from a domain comes from a host authorized by that domain's administrators.",
    use: "This information is helpful for researchers as it helps assess a domain's email security posture, uncover potential vulnerabilities, and verify the legitimacy of emails for phishing detection. These details can also provide insight into the hosting environment, potential service providers, and the configuration patterns of a target organization, assisting in investigative efforts.",
    resources: [
      { title: 'Intro to DMARC, DKIM, and SPF (via Cloudflare)', link: 'https://www.cloudflare.com/learning/email-security/dmarc-dkim-spf/' },
      { title: 'EasyDMARC Domain Scanner', link: 'https://easydmarc.com/tools/domain-scanner' },
      { title: 'MX Toolbox', link: 'https://mxtoolbox.com/' },
      { title: 'RFC-7208 - SPF', link: 'https://datatracker.ietf.org/doc/html/rfc7208' },
      { title: 'RFC-6376 - DKIM', link: 'https://datatracker.ietf.org/doc/html/rfc6376' },
      { title: 'RFC-7489 - DMARC', link: 'https://datatracker.ietf.org/doc/html/rfc7489' },
      { title: 'BIMI Group', link: 'https://bimigroup.org/' },
    ],
    screenshot: 'https://i.ibb.co/yqhwx5G/Screenshot-from-2023-07-29-18-22-20.png',
  },
  {
    id: 'firewall',
    title: 'Firewall Detection',
    description: 'A WAF or web application firewall helps protect web applications by filtering and monitoring HTTP traffic between a web application and the Internet. It typically protects web applications from attacks such as cross-site forgery, cross-site-scripting (XSS), file inclusion, and SQL injection, among others.',
    use: 'It\'s useful to understand if a site is using a WAF, and which firewall software / service it is using, as this provides an insight into the sites protection against several attack vectors, but also may reveal vulnerabilities in the firewall itself.',
    resources: [
      { title: 'What is a WAF (via Cloudflare Learning)', link: 'https://www.cloudflare.com/learning/ddos/glossary/web-application-firewall-waf/' },
      { title: 'OWASP - Web Application Firewalls', link: 'https://owasp.org/www-community/Web_Application_Firewall' },
      { title: 'Web Application Firewall Best Practices', link: 'https://owasp.org/www-pdf-archive/Best_Practices_Guide_WAF_v104.en.pdf' },
      { title: 'WAF - Wiki', link: 'https://en.wikipedia.org/wiki/Web_application_firewall' },
    ],
    screenshot: 'https://i.ibb.co/MfcxQt2/Screenshot-from-2023-08-12-15-40-52.png',
  },
  {
    id: 'http-security',
    title: 'HTTP Security Features',
    description: 'Correctly configured security HTTP headers adds a layer of protection against common attacks to your site. The main headers to be aware of are: '
    + 'HTTP Strict Transport Security (HSTS): Enforces the use of HTTPS, mitigating man-in-the-middle attacks and protocol downgrade attempts. '
    + 'Content Security Policy (CSP): Constrains web page resources to prevent cross-site scripting and data injection attacks. '
    + 'X-Content-Type-Options: Prevents browsers from MIME-sniffing a response away from the declared content type, curbing MIME-type confusion attacks. '
    + 'X-Frame-Options: Protects users from clickjacking attacks by controlling whether a browser should render the page in a <frame>, <iframe>, <embed>, or <object>. ',
    use: 'Reviewing security headers is important, as it offers insights into a site\'s defensive posture and potential vulnerabilities, enabling proactive mitigation and ensuring compliance with security best practices.',
    resources: [
      { title: 'OWASP Secure Headers Project', link: 'https://owasp.org/www-project-secure-headers/'},
      { title: 'HTTP Header Cheatsheet', link: 'https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html' },
      { title: 'content-security-policy.com', link: 'https://content-security-policy.com/' },
      { title: 'resourcepolicy.fyi', link: 'https://resourcepolicy.fyi/' },
      { title: 'HTTP Security Headers', link: 'https://securityheaders.com/' },
      { title: 'Mozilla Observatory', link: 'https://observatory.mozilla.org/' },
      { title: 'CSP Docs', link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP' },
      { title: 'HSTS Docs', link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security' },
      { title: 'X-Content-Type-Options Docs', link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options' },
      { title: 'X-Frame-Options Docs', link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options' },
      { title: 'X-XSS-Protection Docs', link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-XSS-Protection' },
    ],
    screenshot: 'https://i.ibb.co/LP05HMV/Screenshot-from-2023-08-12-15-40-28.png',
  },
  {
    id: 'archives',
    title: 'Archive History',
    description: 'Fetches full history of archives from the Wayback machine',
    use: 'This is useful for understanding the history of a site, and how it has changed over time. It can also be useful for finding old versions of a site, or for finding content that has been removed.',
    resources: [
      { title: 'Wayback Machine', link: 'https://archive.org/web/'},
    ],
    screenshot: 'https://i.ibb.co/nB9szT1/Screenshot-from-2023-08-14-22-31-16.png',
  },
  {
    id: 'rank',
    title: 'Global Ranking',
    description: 'This check shows the global rank of the requested site. This is only accurate for websites which are in the top 100 million list. We\'re using data from the Tranco project (see below), which collates the top sites on the web from Umbrella, Majestic, Quantcast, the Chrome User Experience Report and Cloudflare Radar.',
    use: 'Knowing a websites overall global rank can be useful for understanding the scale of the site, and for comparing it to other sites. It can also be useful for understanding the relative popularity of a site, and for identifying potential trends.',
    resources: [
      { title: 'Tranco List', link: 'https://tranco-list.eu/' },
      { title: 'Tranco Research Paper', link: 'https://tranco-list.eu/assets/tranco-ndss19.pdf'},
    ],
    screenshot: 'https://i.ibb.co/nkbczgb/Screenshot-from-2023-08-14-22-02-40.png',
  },
  {
    id: 'block-lists',
    title: 'Block Detection',
    description: 'Checks access to the URL using 10+ of the most popular privacy, malware and parental control blocking DNS servers.',
    use: '',
    resources: [
      { title: 'ThreatJammer Lists', link: 'https://threatjammer.com/osint-lists'},
    ],
    screenshot: 'https://i.ibb.co/M5JSXbW/Screenshot-from-2023-08-26-12-12-43.png',
  },
  {
    id: 'threats',
    title: 'Malware & Phishing Detection',
    description: 'Checks if a site appears in several common malware and phishing lists, to determine it\'s threat level.',
    use: 'Knowing if a site is listed as a threat by any of these services can be useful for understanding the reputation of a site, and for identifying potential trends.',
    resources: [
      { title: 'URLHaus', link: 'https://urlhaus-api.abuse.ch/'},
      { title: 'PhishTank', link: 'https://www.phishtank.com/'},
    ],
    screenshot: 'https://i.ibb.co/hYgy621/Screenshot-from-2023-08-26-12-07-47.png',
  },
  {
    id: 'tls-cipher-suites',
    title: 'TLS Cipher Suites',
    description: 'These are combinations of cryptographic algorithms used by the server to establish a secure connection. It includes the key exchange algorithm, bulk encryption algorithm, MAC algorithm, and PRF (pseudorandom function).',
    use: 'This is important info to test for from a security perspective. Because a cipher suite is only as secure as the algorithms that it contains. If the version of encryption or authentication algorithm in a cipher suite have known vulnerabilities the cipher suite and TLS connection may then vulnerable to a downgrade or other attack',
    resources: [
      { title: 'sslscan2 CLI', link: 'https://github.com/rbsec/sslscan' },
      { title: 'ssl-enum-ciphers (NPMAP script)', link: 'https://nmap.org/nsedoc/scripts/ssl-enum-ciphers.html' }
    ],
    screenshot: 'https://i.ibb.co/6ydtH5R/Screenshot-from-2023-08-26-12-09-58.png',
  },
  {
    id: 'tls-security-config',
    title: 'TLS Security Config',
    description: 'This uses guidelines from Mozilla\'s TLS Observatory to check the security of the TLS configuration. It checks for bad configurations, which may leave the site vulnerable to attack, as well as giving advice on how to fix. It will also give suggestions around outdated and modern TLS configs',
    use: 'Understanding issues with a site\'s TLS configuration will help you address potential vulnerabilities, and ensure the site is using the latest and most secure TLS configuration.',
    resources: [],
    screenshot: 'https://i.ibb.co/FmksZJt/Screenshot-from-2023-08-26-12-12-09.png',
  },
  {
    id: 'tls-client-support',
    title: 'TLS Handshake Simulation',
    description: 'This simulates how different clients (browsers, operating systems) would perform a TLS handshake with the server. It helps identify compatibility issues and insecure configurations.',
    use: '',
    resources: [
      { title: 'TLS Handshakes (via Cloudflare Learning)', link: 'https://www.cloudflare.com/learning/ssl/what-happens-in-a-tls-handshake/' },
      { title: 'SSL Test (via SSL Labs)', link: 'https://www.ssllabs.com/ssltest/' },
    ],
    screenshot: 'https://i.ibb.co/F7qRZkh/Screenshot-from-2023-08-26-12-11-28.png',
  },
  {
    id: 'screenshot',
    title: 'Screenshot',
    description: 'This check takes a screenshot of webpage that the requested URL / IP resolves to, and displays it.',
    use: 'This may be useful to see what a given website looks like, free of the constraints of your browser, IP, or location.',
    resources: [],
    screenshot: 'https://i.ibb.co/2F0x8kP/Screenshot-from-2023-07-29-18-34-48.png',
  },
];

export const featureIntro = [
  'When conducting an OSINT investigation on a given website or host, there are several key areas to look at. Each of these are documented below, along with links to the tools and techniques you can use to gather the relevant information.',
  'Web-Check can automate the process of gathering this data, but it will be up to you to interpret the results and draw conclusions.',
];

export const about = [
`Web-Check is a powerful all-in-one tool for discovering information about a website/host.
The core philosophy is simple: feed Web-Check a URL and let it gather, collate, and present a broad array of open data for you to delve into.`,

`The report shines a spotlight onto potential attack vectors, existing security measures,
and the web of connections within a site's architecture.
The results can also help optimizing server responses, configuring redirects,
managing cookies, or fine-tuning DNS records for your site.`,

`So, weather you're a developer, system administrator, security researcher, penetration
tester or are just interested in discovering the underlying technologies of a given site 
- I'm sure you'll find this a useful addition to your toolbox.`,
];

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

export const supportUs = [
  "Web-Check is free to use without restriction.",
  "All the code is open source, so you're also free to deploy your own instance, as well as fork, modify and distribute the code in both private and commerical settings.",
  "Running web-check does cost me a small amount of money each month, so if you're finding the app useful, consider <a href='https://github.com/sponsors/Lissy93'>sponsoring me on GitHub</a> if you're able to. Even just $1 or $2/month would be a huge help in supporting the ongoing project running costs.",
  "Otherwise, there are other ways you can help out, like submitting or reviewing a pull request to the <a href='https://github.com/Lissy93/web-check'>GitHub repo</a>, upvoting us on <a href='https://www.producthunt.com/posts/web-check'>Product Hunt</a>, or by sharing with your network.",
  "But don't feel obliged to do anything, as this app (and all my other projects) will always remain 100% free and open source, and I will do my best to ensure the managed instances remain up and available for as long as possible :)",
];

export const fairUse = [
  'Please use this tool responsibly. Do not use it for hosts you do not have permission to scan. Do not use it as part of a scheme to attack or disrupt services.',
  'Requests may be rate-limited to prevent abuse. If you need to make more bandwidth, please deploy your own instance.',
  'There is no guarantee of uptime or availability. If you need to make sure the service is available, please deploy your own instance.',
  'Please use fairly, as excessive use will quickly deplete the lambda function credits, making the service unavailable for others (and/or empty my bank account!).',
];

export default docs;
