import type { JobsState } from 'client/jobs/types';
import { allCards } from 'client/jobs/registry';
import type { Analyzer, Finding } from './types';

import httpSecurity from './rules/http-security';
import hsts from './rules/hsts';
import ssl from './rules/ssl';
import dnssec from './rules/dnssec';
import securityTxt from './rules/security-txt';
import threats from './rules/threats';
import blockLists from './rules/block-lists';
import firewall from './rules/firewall';
import cookies from './rules/cookies';
import headers from './rules/headers';
import ports from './rules/ports';
import mailConfig from './rules/mail-config';
import txtRecords from './rules/txt-records';
import tlsConnection from './rules/tls-connection';
import tlsSecurityAudit from './rules/tls-security-audit';
import quality from './rules/quality';
import socialTags from './rules/social-tags';
import whois from './rules/whois';
import status from './rules/status';
import redirects from './rules/redirects';
import serverInfo from './rules/server-info';
import robotsTxt from './rules/robots-txt';
import tlsClientCompat from './rules/tls-client-compat';

/* Map of card id to its pure analyzer */
export const analyzers: Record<string, Analyzer> = {
  'http-security': httpSecurity,
  hsts,
  ssl,
  dnssec,
  'security-txt': securityTxt,
  threats,
  'block-lists': blockLists,
  firewall,
  cookies,
  headers,
  ports,
  'mail-config': mailConfig,
  'txt-records': txtRecords,
  'tls-connection': tlsConnection,
  'tls-security-audit': tlsSecurityAudit,
  quality,
  'social-tags': socialTags,
  whois,
  status,
  redirects,
  'server-info': serverInfo,
  'robots-txt': robotsTxt,
  'tls-client-compat': tlsClientCompat,
};

/* Run each analyzer against successful job state with valid object payload */
export const runAnalysis = (state: JobsState): Finding[] =>
  allCards.flatMap(({ card }) => {
    const fn = analyzers[card.id];
    const entry = state[card.id];
    if (!fn || entry?.state !== 'success') return [];
    const raw = entry.raw;
    if (raw == null || typeof raw !== 'object') return [];
    try {
      return fn(raw).map((f) => ({ ...f, cardId: card.id }));
    } catch {
      return [];
    }
  });
