import type { Analyzer } from '../types';

// DNSSEC enabled when DNSKEY + DS records exist for the zone
const dnssec: Analyzer = (d) => {
  const dnskey = !!d.DNSKEY?.isFound;
  const ds = !!d.DS?.isFound;
  if (dnskey && ds) {
    return [{ severity: 'pass', title: 'DNSSEC enabled' }];
  }
  return [
    {
      severity: 'warning',
      title: 'DNSSEC not enabled',
      detail: 'Sign DNS records to prevent spoofing and cache poisoning',
    },
  ];
};

export default dnssec;
