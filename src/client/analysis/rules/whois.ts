import type { Analyzer } from '../types';
import { daysUntil } from '../helpers';

// Warn when a domain is close to expiring so renewal can happen on time
const whois: Analyzer = (d) => {
  const days = daysUntil(d.expires);
  if (days === null) return [];
  if (days < 0) {
    return [
      {
        severity: 'critical',
        title: 'Domain registration expired',
        detail: `Expired ${-days} day(s) ago, renew before it drops`,
      },
    ];
  }
  if (days <= 7) {
    return [
      {
        severity: 'critical',
        title: 'Domain expires within a week',
        detail: `Expires in ${days} day(s), renew immediately`,
      },
    ];
  }
  if (days <= 30) {
    return [
      {
        severity: 'warning',
        title: 'Domain expires within a month',
        detail: `Expires in ${days} day(s)`,
      },
    ];
  }
  return [{ severity: 'pass', title: 'Domain registration is valid' }];
};

export default whois;
