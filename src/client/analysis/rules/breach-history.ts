import type { Analyzer } from '../types';

const MAX_LISTED = 4;

// A catalogued breach is history, not a live misconfiguration, so it is never
// reported as critical alongside something an attacker can exploit right now.
// It is still worth surfacing: it says credentials for this service have
// already circulated.
const breachHistory: Analyzer = (d) => {
  const breaches: any[] = Array.isArray(d?.breaches) ? d.breaches : [];
  if (!breaches.length) {
    return d?.domain ? [{ severity: 'pass', title: 'No known data breaches on record' }] : [];
  }

  const named = (list: any[]) => {
    const names = list
      .slice(0, MAX_LISTED)
      .map((b) => b.title || b.name)
      .join(', ');
    return list.length > MAX_LISTED ? `${names} (+${list.length - MAX_LISTED} more)` : names;
  };

  const confirmed = breaches.filter((b) => b.trustworthy);
  const unconfirmed = breaches.filter((b) => !b.trustworthy);
  const leakedCredentials = confirmed.filter((b) => b.severity === 'critical');
  const otherConfirmed = confirmed.filter((b) => b.severity !== 'critical');

  const findings = [];

  if (leakedCredentials.length) {
    findings.push({
      severity: 'issue' as const,
      title: `Credentials exposed in ${leakedCredentials.length} past breach(es) of this service`,
      detail:
        `${named(leakedCredentials)}. Assume affected passwords are public: enforce a reset, ` +
        'and rate-limit or monitor logins for credential stuffing',
    });
  }

  if (otherConfirmed.length) {
    findings.push({
      severity: 'warning' as const,
      title: `${otherConfirmed.length} past data breach(es) recorded for this service`,
      detail: `${named(otherConfirmed)}. User data was exposed, but no credentials were included`,
    });
  }

  if (unconfirmed.length) {
    findings.push({
      severity: 'info' as const,
      title: `${unconfirmed.length} unconfirmed breach(es) listed against this domain`,
      detail: `${named(unconfirmed)}. Unverified, fabricated or spam-list entries — treat with care`,
    });
  }

  return findings;
};

export default breachHistory;
