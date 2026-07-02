import type { Analyzer } from '../types';

// Surface raw-domain SPF policy strength in addition to the mail-config view
const txtRecords: Analyzer = (d) => {
  const spf = Object.entries(d).find(
    ([k, v]) => /^v_*$/.test(k) && typeof v === 'string' && v.startsWith('spf1'),
  );
  if (!spf) return [];
  const value = String(spf[1]);
  if (/[+?]all\b/i.test(value)) {
    return [
      {
        severity: 'warning',
        title: 'Root SPF record is overly permissive',
        detail: 'Replace +all/?all with ~all or -all to reject spoofed mail',
      },
    ];
  }
  return [];
};

export default txtRecords;
