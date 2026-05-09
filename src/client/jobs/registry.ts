import { parseJson } from 'client/utils/parse-json';
import { getLocation, parseShodanResults } from 'client/utils/result-processor';

import ServerLocationCard from 'client/components/Results/ServerLocation';
import ServerInfoCard from 'client/components/Results/ServerInfo';
import HostNamesCard from 'client/components/Results/HostNames';
import WhoIsCard from 'client/components/Results/WhoIs';
import LighthouseCard from 'client/components/Results/Lighthouse';
import ScreenshotCard from 'client/components/Results/Screenshot';
import SslCertCard from 'client/components/Results/SslCert';
import HeadersCard from 'client/components/Results/Headers';
import CookiesCard from 'client/components/Results/Cookies';
import RobotsTxtCard from 'client/components/Results/RobotsTxt';
import DnsRecordsCard from 'client/components/Results/DnsRecords';
import RedirectsCard from 'client/components/Results/Redirects';
import TxtRecordCard from 'client/components/Results/TxtRecords';
import ServerStatusCard from 'client/components/Results/ServerStatus';
import OpenPortsCard from 'client/components/Results/OpenPorts';
import TraceRouteCard from 'client/components/Results/TraceRoute';
import CarbonFootprintCard from 'client/components/Results/CarbonFootprint';
import DnsSecCard from 'client/components/Results/DnsSec';
import HstsCard from 'client/components/Results/Hsts';
import SitemapCard from 'client/components/Results/Sitemap';
import DomainLookup from 'client/components/Results/DomainLookup';
import DnsServerCard from 'client/components/Results/DnsServer';
import TechStackCard from 'client/components/Results/TechStack';
import SecurityTxtCard from 'client/components/Results/SecurityTxt';
import ContentLinksCard from 'client/components/Results/ContentLinks';
import SocialTagsCard from 'client/components/Results/SocialTags';
import MailConfigCard from 'client/components/Results/MailConfig';
import HttpSecurityCard from 'client/components/Results/HttpSecurity';
import FirewallCard from 'client/components/Results/Firewall';
import ArchivesCard from 'client/components/Results/Archives';
import RankCard from 'client/components/Results/Rank';
import BlockListsCard from 'client/components/Results/BlockLists';
import ThreatsCard from 'client/components/Results/Threats';
import TlsConnectionCard from 'client/components/Results/TlsConnection';
import TlsSecurityAuditCard from 'client/components/Results/TlsSecurityAudit';
import TlsClientCompatCard from 'client/components/Results/TlsClientCompat';

import type { JobSpec, JobContext, JobsState } from './types';

const URL_ONLY = ['url'] as const;

// Build a fetcher that hits a local /api path then maps the success body
const fetchAndProcess =
  (path: string, process: (raw: any) => any = (r) => r) =>
  async (ctx: JobContext) => {
    const target = path.includes('${ip}') ? ctx.ipAddress || '' : ctx.address;
    const url = path.replace(/\$\{(ip|url)\}/g, target);
    const res = await fetch(`${ctx.api}/${url}`, { signal: ctx.signal });
    const raw = await parseJson(res);
    return raw?.error ? raw : process(raw);
  };

const card = (
  id: string,
  title: string,
  tags: string[],
  Component: any,
  extras: { pick?: any; fallback?: any } = {},
) => ({ id, title, tags, Component, ...extras });

// Pick a child key of the raw response, null when missing so cards hide cleanly
const at = (key: string) => (raw: any) => raw?.[key] ?? null;

export const jobs: JobSpec[] = [
  {
    id: 'get-ip',
    cards: [],
    expectedAddressTypes: [...URL_ONLY],
    fetcher: fetchAndProcess('get-ip?url=${url}', (r) => r.ip),
  },
  {
    id: 'location',
    needsIp: true,
    cards: [
      card('location', 'Server Location', ['server'], ServerLocationCard, { pick: getLocation }),
    ],
    fetcher: fetchAndProcess('location?url=${ip}'),
  },
  {
    id: 'ssl',
    expectedAddressTypes: [...URL_ONLY],
    cards: [card('ssl', 'SSL Certificate', ['server', 'security'], SslCertCard)],
    fetcher: fetchAndProcess('ssl?url=${url}'),
  },
  {
    id: 'whois',
    expectedAddressTypes: [...URL_ONLY],
    cards: [
      card('domain', 'Domain Whois', ['server'], DomainLookup),
      card('whois', 'Domain Info', ['server'], WhoIsCard),
    ],
    fetcher: fetchAndProcess('whois?url=${url}'),
  },
  {
    id: 'quality',
    expectedAddressTypes: [...URL_ONLY],
    cards: [card('quality', 'Quality Summary', ['client'], LighthouseCard)],
    fetcher: fetchAndProcess('quality?url=${url}'),
  },
  {
    id: 'tech-stack',
    expectedAddressTypes: [...URL_ONLY],
    cards: [card('tech-stack', 'Tech Stack', ['client', 'meta'], TechStackCard)],
    fetcher: fetchAndProcess('tech-stack?url=${url}'),
  },
  {
    id: 'shodan',
    needsIp: true,
    cards: [
      card('hosts', 'Host Names', ['server'], HostNamesCard, { pick: at('hostnames') }),
      card('server-info', 'Server Info', ['server'], ServerInfoCard, { pick: at('serverInfo') }),
    ],
    fetcher: fetchAndProcess('shodan?url=${ip}', parseShodanResults),
  },
  {
    id: 'cookies',
    expectedAddressTypes: [...URL_ONLY],
    cards: [card('cookies', 'Cookies', ['client', 'security'], CookiesCard)],
    fetcher: fetchAndProcess('cookies?url=${url}'),
  },
  {
    id: 'headers',
    expectedAddressTypes: [...URL_ONLY],
    cards: [card('headers', 'Headers', ['client', 'security'], HeadersCard)],
    fetcher: fetchAndProcess('headers?url=${url}'),
  },
  {
    id: 'dns',
    expectedAddressTypes: [...URL_ONLY],
    cards: [card('dns', 'DNS Records', ['server'], DnsRecordsCard)],
    fetcher: fetchAndProcess('dns?url=${url}'),
  },
  {
    id: 'http-security',
    expectedAddressTypes: [...URL_ONLY],
    cards: [card('http-security', 'HTTP Security', ['security'], HttpSecurityCard)],
    fetcher: fetchAndProcess('http-security?url=${url}'),
  },
  {
    id: 'tls-connection',
    expectedAddressTypes: [...URL_ONLY],
    cards: [card('tls-connection', 'TLS Connection', ['server', 'security'], TlsConnectionCard)],
    fetcher: fetchAndProcess('tls-connection?url=${url}'),
  },
  {
    id: 'tls-labs',
    expectedAddressTypes: [...URL_ONLY],
    cards: [
      card('tls-security-audit', 'TLS Security Audit', ['security'], TlsSecurityAuditCard),
      card('tls-client-compat', 'TLS Client Compatibility', ['security'], TlsClientCompatCard),
    ],
    fetcher: fetchAndProcess('tls-labs?url=${url}'),
  },
  {
    id: 'trace-route',
    expectedAddressTypes: [...URL_ONLY],
    cards: [card('trace-route', 'Trace Route', ['server'], TraceRouteCard)],
    fetcher: fetchAndProcess('trace-route?url=${url}'),
  },
  {
    id: 'security-txt',
    expectedAddressTypes: [...URL_ONLY],
    cards: [card('security-txt', 'Security.Txt', ['security'], SecurityTxtCard)],
    fetcher: fetchAndProcess('security-txt?url=${url}'),
  },
  {
    id: 'dns-server',
    expectedAddressTypes: [...URL_ONLY],
    cards: [card('dns-server', 'Server Info', ['server'], DnsServerCard)],
    fetcher: fetchAndProcess('dns-server?url=${url}'),
  },
  {
    id: 'firewall',
    expectedAddressTypes: [...URL_ONLY],
    cards: [card('firewall', 'Firewall', ['server', 'security'], FirewallCard)],
    fetcher: fetchAndProcess('firewall?url=${url}'),
  },
  {
    id: 'dnssec',
    expectedAddressTypes: [...URL_ONLY],
    cards: [card('dnssec', 'DNSSEC', ['security'], DnsSecCard)],
    fetcher: fetchAndProcess('dnssec?url=${url}'),
  },
  {
    id: 'hsts',
    expectedAddressTypes: [...URL_ONLY],
    cards: [card('hsts', 'HSTS Check', ['security'], HstsCard)],
    fetcher: fetchAndProcess('hsts?url=${url}'),
  },
  {
    id: 'threats',
    expectedAddressTypes: [...URL_ONLY],
    cards: [card('threats', 'Threats', ['security'], ThreatsCard)],
    fetcher: fetchAndProcess('threats?url=${url}'),
  },
  {
    id: 'mail-config',
    expectedAddressTypes: [...URL_ONLY],
    cards: [card('mail-config', 'Email Configuration', ['server'], MailConfigCard)],
    fetcher: fetchAndProcess('mail-config?url=${url}'),
  },
  {
    id: 'archives',
    expectedAddressTypes: [...URL_ONLY],
    cards: [card('archives', 'Archive History', ['meta'], ArchivesCard)],
    fetcher: fetchAndProcess('archives?url=${url}'),
  },
  {
    id: 'rank',
    expectedAddressTypes: [...URL_ONLY],
    cards: [card('rank', 'Global Ranking', ['meta'], RankCard)],
    fetcher: fetchAndProcess('rank?url=${url}'),
  },
  {
    id: 'redirects',
    expectedAddressTypes: [...URL_ONLY],
    cards: [card('redirects', 'Redirects', ['meta'], RedirectsCard)],
    fetcher: fetchAndProcess('redirects?url=${url}'),
  },
  {
    id: 'linked-pages',
    expectedAddressTypes: [...URL_ONLY],
    cards: [card('linked-pages', 'Linked Pages', ['client', 'meta'], ContentLinksCard)],
    fetcher: fetchAndProcess('linked-pages?url=${url}'),
  },
  {
    id: 'robots-txt',
    expectedAddressTypes: [...URL_ONLY],
    cards: [card('robots-txt', 'Crawl Rules', ['meta'], RobotsTxtCard)],
    fetcher: fetchAndProcess('robots-txt?url=${url}'),
  },
  {
    id: 'status',
    expectedAddressTypes: [...URL_ONLY],
    cards: [card('status', 'Server Status', ['server'], ServerStatusCard)],
    fetcher: fetchAndProcess('status?url=${url}'),
  },
  {
    id: 'ports',
    needsIp: true,
    cards: [card('ports', 'Open Ports', ['server'], OpenPortsCard)],
    fetcher: fetchAndProcess('ports?url=${ip}'),
  },
  {
    id: 'txt-records',
    expectedAddressTypes: [...URL_ONLY],
    cards: [card('txt-records', 'TXT Records', ['server'], TxtRecordCard)],
    fetcher: fetchAndProcess('txt-records?url=${url}'),
  },
  {
    id: 'block-lists',
    expectedAddressTypes: [...URL_ONLY],
    cards: [card('block-lists', 'Block Lists', ['security', 'meta'], BlockListsCard)],
    fetcher: fetchAndProcess('block-lists?url=${url}'),
  },
  {
    id: 'sitemap',
    expectedAddressTypes: [...URL_ONLY],
    cards: [card('sitemap', 'Pages', ['meta'], SitemapCard)],
    fetcher: fetchAndProcess('sitemap?url=${url}'),
  },
  {
    id: 'screenshot',
    expectedAddressTypes: [...URL_ONLY],
    cards: [
      card('screenshot', 'Screenshot', ['client', 'meta'], ScreenshotCard, {
        fallback: (state: JobsState) => state.quality?.raw?.fullPageScreenshot?.screenshot,
      }),
    ],
    fetcher: fetchAndProcess('screenshot?url=${url}'),
  },
  {
    id: 'social-tags',
    expectedAddressTypes: [...URL_ONLY],
    cards: [card('social-tags', 'Social Tags', ['client', 'meta'], SocialTagsCard)],
    fetcher: fetchAndProcess('social-tags?url=${url}'),
  },
  {
    id: 'carbon',
    expectedAddressTypes: [...URL_ONLY],
    cards: [card('carbon', 'Carbon Footprint', ['meta'], CarbonFootprintCard)],
    fetcher: fetchAndProcess('carbon?url=${url}'),
  },
];

// Flat list of every card id (1+ per job). Used by ProgressBar and the result grid
export const allCardIds: string[] = jobs.flatMap((j) => j.cards.map((c) => c.id));

export const allCards: Array<{ jobId: string; card: JobSpec['cards'][number] }> = jobs.flatMap(
  (j) => j.cards.map((card) => ({ jobId: j.id, card })),
);
