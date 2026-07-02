import type { Analyzer } from '../types';

const MIN_MAX_AGE = 10886400;

// Check HSTS presence, max-age, includeSubDomains, preload
const hsts: Analyzer = (d) => {
  if (!d.hstsHeader) {
    return [
      {
        severity: 'issue',
        title: 'No HSTS header',
        detail: 'Add Strict-Transport-Security to enforce HTTPS for clients',
      },
    ];
  }
  const header = String(d.hstsHeader).toLowerCase();
  const maxAge = parseInt(header.match(/max-age=(\d+)/)?.[1] || '0', 10);
  const out: ReturnType<Analyzer> = [];
  if (maxAge < MIN_MAX_AGE) {
    out.push({
      severity: 'warning',
      title: `HSTS max-age below ${MIN_MAX_AGE}`,
      detail: `Current max-age is ${maxAge}, raise it for preload eligibility`,
    });
  }
  if (!header.includes('includesubdomains')) {
    out.push({
      severity: 'warning',
      title: 'HSTS missing includeSubDomains',
      detail: 'Add includeSubDomains to protect every subdomain',
    });
  }
  if (!header.includes('preload')) {
    out.push({
      severity: 'info',
      title: 'HSTS missing preload directive',
      detail: 'Add preload to qualify for the HSTS preload list',
    });
  }
  if (d.compatible) out.push({ severity: 'pass', title: 'HSTS preload compatible' });
  return out;
};

export default hsts;
