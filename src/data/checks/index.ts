import type { CategoryId } from '@/data/categories';

import getIp from './get-ip';
import ssl from './ssl';
import dns from './dns';
import cookies from './cookies';
import robotsTxt from './robots-txt';
import headers from './headers';
import quality from './quality';
import location from './location';
import hosts from './hosts';
import redirects from './redirects';
import txtRecords from './txt-records';
import status from './status';
import ports from './ports';
import traceRoute from './trace-route';
import carbon from './carbon';
import serverInfo from './server-info';
import vulnerabilities from './vulnerabilities';
import domain from './domain';
import whois from './whois';
import dnssec from './dnssec';
import hsts from './hsts';
import dnsServer from './dns-server';
import techStack from './tech-stack';
import sitemap from './sitemap';
import securityTxt from './security-txt';
import linkedPages from './linked-pages';
import socialTags from './social-tags';
import socialPresence from './social-presence';
import mailConfig from './mail-config';
import firewall from './firewall';
import httpSecurity from './http-security';
import archives from './archives';
import rank from './rank';
import blockLists from './block-lists';
import threats from './threats';
import tlsConnection from './tls-connection';
import tlsSecurityAudit from './tls-security-audit';
import tlsClientCompat from './tls-client-compat';
import screenshot from './screenshot';
import subdomains from './subdomains';

export type Resource = string | { title: string; link: string };

export interface Check {
  title: string;
  categories: CategoryId[];
  summary: string;
  description: string;
  use: string;
  resources: Resource[];
  screenshot?: string;
}

const all = {
  'get-ip': getIp,
  ssl,
  dns,
  cookies,
  'robots-txt': robotsTxt,
  headers,
  quality,
  location,
  hosts,
  redirects,
  'txt-records': txtRecords,
  status,
  ports,
  'trace-route': traceRoute,
  carbon,
  'server-info': serverInfo,
  vulnerabilities,
  domain,
  whois,
  dnssec,
  hsts,
  'dns-server': dnsServer,
  'tech-stack': techStack,
  sitemap,
  'security-txt': securityTxt,
  'linked-pages': linkedPages,
  'social-tags': socialTags,
  'social-presence': socialPresence,
  'mail-config': mailConfig,
  firewall,
  'http-security': httpSecurity,
  archives,
  rank,
  'block-lists': blockLists,
  threats,
  'tls-connection': tlsConnection,
  'tls-security-audit': tlsSecurityAudit,
  'tls-client-compat': tlsClientCompat,
  screenshot,
  subdomains,
};

export type CheckId = keyof typeof all;

export const checks: Record<CheckId, Check> = all;

export const checkIds = Object.keys(all) as CheckId[];

export const isCheck = (value: string): value is CheckId => (checkIds as string[]).includes(value);

export const checksInCategory = (category: CategoryId): CheckId[] =>
  checkIds.filter((id) => checks[id].categories.includes(category));
