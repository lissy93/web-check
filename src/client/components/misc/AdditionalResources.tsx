import styled from '@emotion/styled';
import colors from 'client/styles/colors';
import { Card } from 'client/components/Form/Card';

const ResourceListOuter = styled.ul`
  list-style: none;
  margin: 0;
  padding: 1rem;
  display: grid;
  gap: 0.5rem;
  grid-template-columns: repeat(auto-fit, minmax(19rem, 1fr));
  li a.resource-wrap {
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 0.25rem;
    padding: 0.25rem 0.5rem;
    background: ${colors.background};
    border-radius: 8px;
    text-decoration: none;
    color: ${colors.textColor};
    height: 100%;

    transition: all 0.2s ease-in-out;
    cursor: pointer;
    border: none;
    border-radius: 0.25rem;
    font-family: var(--font-mono);
    box-sizing: border-box;
    width: -moz-available;
    box-shadow: 3px 3px 0px ${colors.backgroundDarker};
    &:hover {
      box-shadow: 5px 5px 0px ${colors.backgroundDarker};
      a {
        opacity: 1;
      }
    }
    &:active {
      box-shadow: -3px -3px 0px ${colors.fgShadowColor};
    }
  }
  img {
    width: 2.5rem;
    border-radius: 4px;
    margin: 0.25rem 0.1rem 0.1rem 0.1rem;
  }
  p,
  a {
    margin: 0;
  }
  .resource-link {
    color: ${colors.primary};
    opacity: 0.75;
    font-size: 0.9rem;
    transition: all 0.2s ease-in-out;
    text-decoration: underline;
    cursor: pointer;
  }
  .resource-title {
    font-weight: bold;
  }
  .resource-lower {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .resource-details {
    max-width: 20rem;
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    .resource-description {
      color: ${colors.textColorSecondary};
      font-size: 0.9rem;
    }
  }
`;

const Note = styled.small`
  margin-top: 1rem;
  opacity: 0.5;
  display: block;
  a {
    color: ${colors.primary};
  }
`;

const CardStyles = `
  margin: 0 auto;
  width: 95vw;
  position: relative;
  transition: all 0.2s ease-in-out;
  max-height: 100%;
`;

const resources = [
  {
    title: 'Hudson Rock',
    link: 'https://hudsonrock.com/free-tools/?=webcheck',
    icon: 'https://pixelflare.cc/alicia/icons/hudson-rock.png/w128',
    description: 'Identify Infostealer infection data related to domains and emails',
  },
  {
    title: 'SSL Labs Test',
    link: 'https://ssllabs.com/ssltest/analyze.html',
    icon: 'https://pixelflare.cc/alicia/icons/qualys-ssl-labs.png/w128',
    description: 'Analyzes the SSL configuration of a server and grades it',
    searchLink: 'https://www.ssllabs.com/ssltest/analyze.html?d={DOMAIN}',
  },
  {
    title: 'Virus Total',
    link: 'https://virustotal.com',
    icon: 'https://pixelflare.cc/alicia/icons/virustotal.png/w128',
    description: 'Checks a URL against multiple antivirus engines',
    searchLink: 'https://www.virustotal.com/gui/domain/{DOMAIN}',
  },
  {
    title: 'Shodan',
    link: 'https://shodan.io/',
    icon: 'https://pixelflare.cc/alicia/icons/shodan.png/w128',
    description: 'Search engine for Internet-connected devices',
    searchLink: 'https://www.shodan.io/search/report?query={DOMAIN}',
  },
  {
    title: 'Archive',
    link: 'https://archive.org/',
    icon: 'https://pixelflare.cc/alicia/icons/internet-archive.png/w128',
    description: 'View previous versions of a site via the Internet Archive',
    searchLink: 'https://web.archive.org/web/*/{URL}',
  },
  {
    title: 'URLScan',
    link: 'https://urlscan.io/',
    icon: 'https://pixelflare.cc/alicia/icons/urlscan.png/w128',
    description: 'Scans a URL and provides information about the page',
    searchLink: 'https://urlscan.io/domain/{DOMAIN}',
  },
  {
    title: 'Sucuri SiteCheck',
    link: 'https://sitecheck.sucuri.net/',
    icon: 'https://pixelflare.cc/alicia/icons/sucuri.png/w128',
    description: 'Checks a URL against blacklists and known threats',
    searchLink: 'https://sitecheck.sucuri.net/results/{DOMAIN}',
  },
  {
    title: 'Domain Tools',
    link: 'https://whois.domaintools.com/',
    icon: 'https://pixelflare.cc/alicia/icons/domaintools.png/w128',
    description: 'Run a WhoIs lookup on a domain',
    searchLink: 'https://whois.domaintools.com/{DOMAIN}',
  },
  {
    title: 'NS Lookup',
    link: 'https://nslookup.io/',
    icon: 'https://pixelflare.cc/alicia/icons/nslookup.png/w128',
    description: 'View DNS records for a domain',
    searchLink: 'https://www.nslookup.io/domains/{DOMAIN}/dns-records/',
  },
  {
    title: 'DNS Checker',
    link: 'https://dnschecker.org/',
    icon: 'https://pixelflare.cc/alicia/icons/dns-checker.png/w128',
    description: 'Check global DNS propagation across multiple servers',
    searchLink: 'https://dnschecker.org/#A/{DOMAIN}',
  },
  {
    title: 'Censys',
    link: 'https://search.censys.io/',
    icon: 'https://pixelflare.cc/alicia/icons/censys.png/w128',
    description: 'Lookup hosts associated with a domain',
    searchLink: 'https://search.censys.io/search?resource=hosts&q={DOMAIN}',
  },
  {
    title: 'Page Speed Insights',
    link: 'https://developers.google.com/speed/pagespeed/insights/',
    icon: 'https://pixelflare.cc/alicia/icons/page-speed-insights.png/w128',
    description: 'Checks the performance, accessibility and SEO of a page on mobile + desktop',
    searchLink: 'https://developers.google.com/speed/pagespeed/insights/?url={URL}',
  },
  {
    title: 'Built With',
    link: 'https://builtwith.com/',
    icon: 'https://pixelflare.cc/alicia/icons/built-with.png/w128',
    description: 'View the tech stack of a website',
    searchLink: 'https://builtwith.com/{DOMAIN}',
  },
  {
    title: 'DNS Dumpster',
    link: 'https://dnsdumpster.com/',
    icon: 'https://pixelflare.cc/alicia/icons/dnsdumpster.png/w128',
    description: "DNS recon tool, to map out a domain from it's DNS records",
  },
  {
    title: 'BGP Tools',
    link: 'https://bgp.tools/',
    icon: 'https://pixelflare.cc/alicia/icons/bgp-tools.png/w128',
    description: 'View realtime BGP data for any ASN, Prefix or DNS',
    searchLink: 'https://bgp.tools/dns/{DOMAIN}',
  },
  {
    title: 'Similar Web',
    link: 'https://similarweb.com/',
    icon: 'https://pixelflare.cc/alicia/icons/similar-web.png/w128',
    description: 'View approx traffic and engagement stats for a website',
    searchLink: 'https://similarweb.com/website/{DOMAIN}/',
  },
  {
    title: 'Blacklist Checker',
    link: 'https://blacklistchecker.com/',
    icon: 'https://pixelflare.cc/alicia/icons/black-list-checker.png/w128',
    description: 'Check if a domain, IP or email is present on the top blacklists',
    searchLink: 'https://blacklistchecker.com/check?input={DOMAIN}',
  },
  {
    title: 'Cloudflare Radar',
    link: 'https://radar.cloudflare.com/',
    icon: 'https://pixelflare.cc/alicia/icons/cloudflare.png/w128',
    description: 'View traffic source locations for a domain through Cloudflare',
    searchLink: 'https://radar.cloudflare.com/domains/domain/{DOMAIN}',
  },
  {
    title: 'Mozilla HTTP Observatory',
    link: 'https://developer.mozilla.org/en-US/observatory',
    icon: 'https://pixelflare.cc/alicia/icons/mozilla.png/w128',
    description:
      'Assesses website security posture by analyzing various security headers and practices',
    searchLink: 'https://developer.mozilla.org/en-US/observatory/analyze?host={DOMAIN}',
  },
  {
    title: 'AbuseIPDB',
    link: 'https://abuseipdb.com/',
    icon: 'https://pixelflare.cc/alicia/icons/abuseipdb.png/w128',
    description: "Checks a website against Zscaler's dynamic risk scoring engine",
    searchLink: 'https://www.abuseipdb.com/check?query={DOMAIN}',
  },
  {
    title: 'IBM X-Force Exchange',
    link: 'https://exchange.xforce.ibmcloud.com/',
    icon: 'https://pixelflare.cc/alicia/icons/ibm-x-force-exchange.png/w128',
    description: 'View shared human and machine generated threat intelligence',
    searchLink: 'https://exchange.xforce.ibmcloud.com/url/{URL_ENCODED}',
  },
  {
    title: 'URLVoid',
    link: 'https://urlvoid.com/',
    icon: 'https://pixelflare.cc/alicia/icons/urlvoid.png/w128',
    description: 'Checks a website across 30+ blocklist engines and website reputation services',
    searchLink: 'https://urlvoid.com/scan/{DOMAIN}',
  },
  {
    title: 'URLhaus',
    link: 'https://urlhaus.abuse.ch/',
    icon: 'https://pixelflare.cc/alicia/icons/urlhaus.png/w128',
    description: "Checks if the site is in URLhaus's malware URL exchange",
    searchLink: 'https://urlhaus.abuse.ch/browse.php?search={URL_ENCODED}',
  },
  {
    title: 'ANY.RUN',
    link: 'https://any.run/',
    icon: 'https://pixelflare.cc/alicia/icons/anyrun.png/w128',
    description: 'An interactive malware and web sandbox',
  },
];

const makeLink = (resource: any, scanUrl: string | undefined): string => {
  return scanUrl && resource.searchLink
    ? resource.searchLink
        .replaceAll('{URL}', scanUrl.replace(/(https?:\/\/)?/i, ''))
        .replaceAll(
          '{URL_ENCODED}',
          encodeURIComponent(scanUrl.replace(/(https?:\/\/)?/i, '')).replace(
            /['\.*]/g,
            (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`,
          ),
        )
        .replaceAll(
          '{DOMAIN}',
          scanUrl.replace(/(https?:\/\/)?(www.)?/i, '').replace(/(\/.*)/i, ''),
        )
    : resource.link;
};

const AdditionalResources = (props: { url?: string }): JSX.Element => {
  return (
    <Card heading="External Tools for Further Research" styles={CardStyles}>
      <ResourceListOuter>
        {resources.map((resource, index) => {
          return (
            <li key={index}>
              <a
                className="resource-wrap"
                target="_blank"
                rel="noreferrer"
                href={makeLink(resource, props.url)}
              >
                <p className="resource-title">{resource.title}</p>
                <span
                  className="resource-link"
                  onClick={() => window.open(resource.link, '_blank')}
                  title={`Open: ${resource.link}`}
                >
                  {new URL(resource.link).hostname}
                </span>
                <div className="resource-lower">
                  <img src={resource.icon} alt="" />
                  <div className="resource-details">
                    <p className="resource-description">{resource.description}</p>
                  </div>
                </div>
              </a>
            </li>
          );
        })}
      </ResourceListOuter>
      <Note>
        These tools are not affiliated with Web-Check. Please use them at your own risk.
        <br />
        At the time of listing, all of the above were available and free to use - if this changes,
        please report it via GitHub (
        <a target="_blank" rel="noreferrer" href="https://github.com/lissy93/web-check">
          lissy93/web-check
        </a>
        ).
      </Note>
    </Card>
  );
};

export default AdditionalResources;
