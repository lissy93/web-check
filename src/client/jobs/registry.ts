import { parseJson } from 'client/utils/parse-json';
import { getLocation, parseShodanResults } from 'client/utils/result-processor';

import ServerLocationCard from 'client/components/Results/ServerLocation';
import ServerInfoCard from 'client/components/Results/ServerInfo';
import VulnerabilitiesCard from 'client/components/Results/Vulnerabilities';
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
import SubdomainsCard from 'client/components/Results/Subdomains';

import { checks, type CheckId } from '@/data/checks';
import type { CategoryId } from '@/data/categories';
import type { CardSpec, JobSpec, JobContext, JobsState } from './types';

const URL_ONLY = ['url'] as const;

// Build a fetcher that hits a local /api path then maps the success body
const fetchAndProcess =
  (path: string, process: (raw: any) => any = (r) => r) =>
  async (ctx: JobContext) => {
    const target = path.includes('${ip}') ? ctx.ipAddress || '' : ctx.address;
    const url = path.replace(/\$\{(ip|url)\}/g, encodeURIComponent(target));
    const res = await fetch(`${ctx.api}/${url}`, { signal: ctx.signal });
    const raw = await parseJson(res);
    return raw?.error || raw?.skipped ? raw : process(raw);
  };

// Sleep ms, reject AbortError if signal fires
const sleep = (ms: number, signal: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    if (signal.aborted) return reject(new DOMException('aborted', 'AbortError'));
    const onAbort = () => {
      clearTimeout(timer);
      reject(new DOMException('aborted', 'AbortError'));
    };
    const remove = () => {
      signal.removeEventListener('abort', onAbort);
      resolve();
    };
    const timer = setTimeout(remove, ms);
    signal.addEventListener('abort', onAbort, { once: true });
  });

// Re-run fetchOnce while shouldRetry(raw) holds, sleeping delay ms between attempts
const retrying = (
  path: string,
  shouldRetry: (raw: any) => boolean,
  attempts: number,
  delay: number,
  onExhausted: (last: any) => any,
) => {
  const fetchOnce = fetchAndProcess(path);
  return async (ctx: JobContext) => {
    let last: any;
    for (let i = 0; i < attempts; i++) {
      last = await fetchOnce(ctx);
      if (!shouldRetry(last)) return last;
      if (i < attempts - 1) await sleep(delay, ctx.signal);
    }
    return onExhausted(last);
  };
};

// Re-run while the body has { pending: true }
const fetchAndPoll = (path: string) =>
  retrying(
    path,
    (r) => !!r?.pending,
    6,
    30000,
    () => ({
      error: 'Timed-out waiting for assessment',
    }),
  );

// Re-run on transient errors or when the server hints `retryable: true`
const fetchAndRetry = (path: string) =>
  retrying(
    path,
    (r) => !!r?.error || !!r?.retryable,
    3,
    2000,
    (last) => last,
  );

// Pick a child key of the raw response, null when missing so cards hide cleanly
const at = (key: string) => (raw: any) => raw?.[key] ?? null;

// Pair a check with the component that renders it
const card = (
  id: CheckId,
  Component: CardSpec['Component'],
  extra: Partial<CardSpec> = {},
): CardSpec => ({
  id,
  title: checks[id].title,
  categories: checks[id].categories,
  Component,
  ...extra,
});

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
    cards: [card('location', ServerLocationCard, { pick: getLocation })],
    fetcher: fetchAndProcess('location?url=${ip}'),
  },
  {
    id: 'ssl',
    expectedAddressTypes: [...URL_ONLY],
    cards: [card('ssl', SslCertCard)],
    fetcher: fetchAndProcess('ssl?url=${url}'),
  },
  {
    id: 'whois',
    expectedAddressTypes: [...URL_ONLY],
    cards: [card('domain', DomainLookup), card('whois', WhoIsCard)],
    fetcher: fetchAndProcess('whois?url=${url}'),
  },
  {
    id: 'quality',
    expectedAddressTypes: [...URL_ONLY],
    cards: [card('quality', LighthouseCard)],
    fetcher: fetchAndRetry('quality?url=${url}'),
  },
  {
    id: 'tech-stack',
    expectedAddressTypes: [...URL_ONLY],
    cards: [card('tech-stack', TechStackCard)],
    fetcher: fetchAndProcess('tech-stack?url=${url}'),
  },
  {
    id: 'shodan',
    needsIp: true,
    cards: [
      card('hosts', HostNamesCard, { pick: at('hostnames') }),
      card('server-info', ServerInfoCard, { pick: at('serverInfo') }),
      card('vulnerabilities', VulnerabilitiesCard),
    ],
    fetcher: fetchAndProcess('shodan?url=${ip}', parseShodanResults),
  },
  {
    id: 'cookies',
    expectedAddressTypes: [...URL_ONLY],
    cards: [card('cookies', CookiesCard)],
    fetcher: fetchAndProcess('cookies?url=${url}'),
  },
  {
    id: 'headers',
    expectedAddressTypes: [...URL_ONLY],
    cards: [card('headers', HeadersCard)],
    fetcher: fetchAndProcess('headers?url=${url}'),
  },
  {
    id: 'dns',
    expectedAddressTypes: [...URL_ONLY],
    cards: [card('dns', DnsRecordsCard)],
    fetcher: fetchAndProcess('dns?url=${url}'),
  },
  {
    id: 'http-security',
    expectedAddressTypes: [...URL_ONLY],
    cards: [card('http-security', HttpSecurityCard)],
    fetcher: fetchAndProcess('http-security?url=${url}'),
  },
  {
    id: 'tls-connection',
    expectedAddressTypes: [...URL_ONLY],
    cards: [card('tls-connection', TlsConnectionCard)],
    fetcher: fetchAndProcess('tls-connection?url=${url}'),
  },
  {
    id: 'tls-labs',
    expectedAddressTypes: [...URL_ONLY],
    cards: [
      card('tls-security-audit', TlsSecurityAuditCard),
      card('tls-client-compat', TlsClientCompatCard),
    ],
    fetcher: fetchAndPoll('tls-labs?url=${url}'),
  },
  {
    id: 'subdomains',
    expectedAddressTypes: [...URL_ONLY],
    cards: [card('subdomains', SubdomainsCard)],
    fetcher: fetchAndRetry('subdomains?url=${url}'),
  },
  {
    id: 'trace-route',
    expectedAddressTypes: [...URL_ONLY],
    cards: [card('trace-route', TraceRouteCard)],
    fetcher: fetchAndProcess('trace-route?url=${url}'),
  },
  {
    id: 'security-txt',
    expectedAddressTypes: [...URL_ONLY],
    cards: [card('security-txt', SecurityTxtCard)],
    fetcher: fetchAndProcess('security-txt?url=${url}'),
  },
  {
    id: 'dns-server',
    expectedAddressTypes: [...URL_ONLY],
    cards: [card('dns-server', DnsServerCard)],
    fetcher: fetchAndProcess('dns-server?url=${url}'),
  },
  {
    id: 'firewall',
    expectedAddressTypes: [...URL_ONLY],
    cards: [card('firewall', FirewallCard)],
    fetcher: fetchAndProcess('firewall?url=${url}'),
  },
  {
    id: 'dnssec',
    expectedAddressTypes: [...URL_ONLY],
    cards: [card('dnssec', DnsSecCard)],
    fetcher: fetchAndProcess('dnssec?url=${url}'),
  },
  {
    id: 'hsts',
    expectedAddressTypes: [...URL_ONLY],
    cards: [card('hsts', HstsCard)],
    fetcher: fetchAndProcess('hsts?url=${url}'),
  },
  {
    id: 'threats',
    expectedAddressTypes: [...URL_ONLY],
    cards: [card('threats', ThreatsCard)],
    fetcher: fetchAndProcess('threats?url=${url}'),
  },
  {
    id: 'mail-config',
    expectedAddressTypes: [...URL_ONLY],
    cards: [card('mail-config', MailConfigCard)],
    fetcher: fetchAndProcess('mail-config?url=${url}'),
  },
  {
    id: 'archives',
    expectedAddressTypes: [...URL_ONLY],
    cards: [card('archives', ArchivesCard)],
    fetcher: fetchAndRetry('archives?url=${url}'),
  },
  {
    id: 'rank',
    expectedAddressTypes: [...URL_ONLY],
    cards: [card('rank', RankCard)],
    fetcher: fetchAndProcess('rank?url=${url}'),
  },
  {
    id: 'redirects',
    expectedAddressTypes: [...URL_ONLY],
    cards: [card('redirects', RedirectsCard)],
    fetcher: fetchAndProcess('redirects?url=${url}'),
  },
  {
    id: 'linked-pages',
    expectedAddressTypes: [...URL_ONLY],
    cards: [card('linked-pages', ContentLinksCard)],
    fetcher: fetchAndProcess('linked-pages?url=${url}'),
  },
  {
    id: 'robots-txt',
    expectedAddressTypes: [...URL_ONLY],
    cards: [card('robots-txt', RobotsTxtCard)],
    fetcher: fetchAndProcess('robots-txt?url=${url}'),
  },
  {
    id: 'status',
    expectedAddressTypes: [...URL_ONLY],
    cards: [card('status', ServerStatusCard)],
    fetcher: fetchAndProcess('status?url=${url}'),
  },
  {
    id: 'ports',
    needsIp: true,
    cards: [card('ports', OpenPortsCard)],
    fetcher: fetchAndProcess('ports?url=${ip}'),
  },
  {
    id: 'txt-records',
    expectedAddressTypes: [...URL_ONLY],
    cards: [card('txt-records', TxtRecordCard)],
    fetcher: fetchAndProcess('txt-records?url=${url}'),
  },
  {
    id: 'block-lists',
    expectedAddressTypes: [...URL_ONLY],
    cards: [card('block-lists', BlockListsCard)],
    fetcher: fetchAndProcess('block-lists?url=${url}'),
  },
  {
    id: 'sitemap',
    expectedAddressTypes: [...URL_ONLY],
    cards: [card('sitemap', SitemapCard)],
    fetcher: fetchAndProcess('sitemap?url=${url}'),
  },
  {
    id: 'screenshot',
    expectedAddressTypes: [...URL_ONLY],
    cards: [
      card('screenshot', ScreenshotCard, {
        fallback: (state: JobsState) => state.quality?.raw?.fullPageScreenshot?.screenshot,
      }),
    ],
    fetcher: fetchAndProcess('screenshot?url=${url}'),
  },
  {
    id: 'social-tags',
    expectedAddressTypes: [...URL_ONLY],
    cards: [card('social-tags', SocialTagsCard)],
    fetcher: fetchAndProcess('social-tags?url=${url}'),
  },
  {
    id: 'carbon',
    expectedAddressTypes: [...URL_ONLY],
    cards: [card('carbon', CarbonFootprintCard)],
    fetcher: fetchAndProcess('carbon?url=${url}'),
  },
];

const inCategory = (card: JobSpec['cards'][number], category?: CategoryId) =>
  !category || card.categories.includes(category);

// Jobs to run for a category filter, cardless jobs like get-ip always run
export const jobsForCategory = (category?: CategoryId): JobSpec[] =>
  jobs.filter((j) => !j.cards.length || j.cards.some((c) => inCategory(c, category)));

// Cards to show for a category filter, each paired with its owning job id
export const cardsForCategory = (
  category?: CategoryId,
): Array<{ jobId: string; card: JobSpec['cards'][number] }> =>
  jobsForCategory(category).flatMap((j) =>
    j.cards.filter((c) => inCategory(c, category)).map((card) => ({ jobId: j.id, card })),
  );

export const allCards = cardsForCategory();
