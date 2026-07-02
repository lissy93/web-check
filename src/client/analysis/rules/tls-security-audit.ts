import type { Analyzer, Severity } from '../types';

// Map SSL Labs grade to severity. Labs uses A+/A/A-/B/C/T/F/M (no D/E)
const GRADE_SEVERITY: Record<string, Severity> = {
  'A+': 'pass',
  A: 'pass',
  'A-': 'pass',
  B: 'warning',
  C: 'issue',
  F: 'critical',
  T: 'critical',
  M: 'critical',
};

const RANK: Severity[] = ['pass', 'info', 'warning', 'issue', 'critical'];
const rank = (s: Severity) => RANK.indexOf(s);

// Surface the worst SSL Labs endpoint grade for this host
const tlsSecurityAudit: Analyzer = (d) => {
  if (!d || !Array.isArray(d.endpoints) || !d.endpoints.length) return [];
  const grades: string[] = [];
  for (const e of d.endpoints) {
    if (e && typeof e.grade === 'string') grades.push(e.grade);
  }
  if (!grades.length) return [];
  let severity: Severity = 'pass';
  for (const g of grades) {
    const sev = GRADE_SEVERITY[g] || 'info';
    if (rank(sev) > rank(severity)) severity = sev;
  }
  const worstGrade = grades.find((g) => GRADE_SEVERITY[g] === severity) || grades[0];
  if (severity === 'pass') {
    return [{ severity: 'pass', title: `SSL Labs grade ${worstGrade}` }];
  }
  return [
    {
      severity,
      title: `SSL Labs grade ${worstGrade}`,
      detail: 'Review cipher suites, protocol versions and key strength',
    },
  ];
};

export default tlsSecurityAudit;
