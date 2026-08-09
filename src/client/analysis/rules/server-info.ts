import type { Analyzer, Severity } from '../types';
import type { CveEntry, CvePriorityLevel } from 'client/utils/result-processor';
import { asCveIntel } from 'client/utils/result-processor';

const MAX_LISTED = 8;

// Report each CVE at the severity its KEV/EPSS evidence supports, rather than
// treating everything Shodan attributes to the host as equally urgent
const SEVERITY: Record<CvePriorityLevel, Severity> = {
  critical: 'critical',
  high: 'issue',
  medium: 'warning',
  low: 'info',
};

const HEADLINE: Record<CvePriorityLevel, (count: number) => string> = {
  critical: (n) => `${n} CVE(s) on this host are confirmed exploited in the wild`,
  high: (n) => `${n} CVE(s) on this host are likely to be exploited soon`,
  medium: (n) => `${n} CVE(s) on this host are worth scheduling a patch for`,
  low: (n) => `${n} further CVE(s) reported by Shodan`,
};

const ADVICE: Record<CvePriorityLevel, string> = {
  critical: 'Listed in the CISA KEV catalog. Patch now, or block at the firewall',
  high: 'EPSS puts exploitation within 30 days above 10%. Patch ahead of the next window',
  medium: 'Patch in the next maintenance window',
  low: 'No evidence of exploitation, but keep the affected services updated',
};

const listOf = (entries: CveEntry[]): string => {
  const ids = entries
    .slice(0, MAX_LISTED)
    .map((entry) => entry.id)
    .join(', ');
  const more = entries.length > MAX_LISTED ? ` (+${entries.length - MAX_LISTED} more)` : '';
  return `${ids}${more}`;
};

const LEVELS = Object.keys(SEVERITY) as CvePriorityLevel[];

// Surface CVEs Shodan attributes to this host, ranked by CISA KEV and EPSS
const serverInfo: Analyzer = (d) => {
  const intel = asCveIntel(d?.vulns);
  if (!intel.vulns.length) return [];

  // With no feed to rank against — an older API build, or CISA/FIRST being
  // unreachable — we cannot tell the urgent from the ignorable, so every CVE
  // stays critical rather than being quietly downgraded
  if (!intel.feeds.kev?.ok && !intel.feeds.epss?.ok) {
    return [
      {
        severity: 'critical',
        title: `Shodan reports ${intel.vulns.length} CVE(s) on this host`,
        detail: `${listOf(intel.vulns)}. Patch affected services or block at the firewall`,
      },
    ];
  }

  return LEVELS.flatMap((level) => {
    const entries = intel.vulns.filter((entry) => entry.priority.level === level);
    if (!entries.length) return [];
    return [
      {
        severity: SEVERITY[level],
        title: HEADLINE[level](entries.length),
        detail: `${listOf(entries)}. ${ADVICE[level]}`,
      },
    ];
  });
};

export default serverInfo;
