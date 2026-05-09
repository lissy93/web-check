import type { Analyzer } from '../types';

const MAX_LISTED = 8;

// Surface CVEs Shodan attributes to this host
const serverInfo: Analyzer = (d) => {
  if (!d || !Array.isArray(d.vulns) || !d.vulns.length) return [];
  const cves = d.vulns.slice(0, MAX_LISTED).join(', ');
  const more = d.vulns.length > MAX_LISTED ? ` (+${d.vulns.length - MAX_LISTED} more)` : '';
  return [
    {
      severity: 'critical',
      title: `Shodan reports ${d.vulns.length} CVE(s) on this host`,
      detail: `${cves}${more}. Patch affected services or block at the firewall`,
    },
  ];
};

export default serverInfo;
