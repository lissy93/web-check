import type { Analyzer, Finding } from '../types';

const label = (profile: any): string => `${profile.network} @${profile.handle}`;

// Flag claimed social accounts that are missing, or cannot be tied back to the site
const socialPresence: Analyzer = (d) => {
  const profiles: any[] = Array.isArray(d.profiles) ? d.profiles : [];
  const missing = profiles.filter((p) => p.exists === false);
  const unconfirmed = profiles.filter((p) => p.exists && !p.domainVerified && !p.linksBack);
  const confirmed = profiles.filter((p) => p.exists && (p.domainVerified || p.linksBack));
  const unchecked = profiles.filter((p) => p.checked === false);
  const findings: Omit<Finding, 'cardId'>[] = [];

  if (missing.length) {
    findings.push({
      severity: 'issue',
      title: `Social account not found: ${missing.length}`,
      detail: `This site points to ${missing.map(label).join(', ')}, which does not exist`,
    });
  }
  if (unconfirmed.length) {
    findings.push({
      severity: 'warning',
      title: `Unconfirmed social accounts: ${unconfirmed.length}`,
      detail: `${unconfirmed.map(label).join(', ')} does not link back to this site`,
    });
  }
  if (!findings.length && confirmed.length && !unchecked.length) {
    findings.push({ severity: 'pass', title: 'Social accounts link back to this site' });
  }
  return findings;
};

export default socialPresence;
