import type { Analyzer, Severity } from '../types';

// Map SSL Labs grade to severity. Labs uses A+/A/A-/B/C/D/E/F/T/M
const GRADE_SEVERITY: Record<string, Severity> = {
  'A+': 'pass',
  A: 'pass',
  'A-': 'pass',
  B: 'warning',
  C: 'issue',
  D: 'issue',
  E: 'critical',
  F: 'critical',
  T: 'critical',
  M: 'critical',
};

const RANK: Severity[] = ['pass', 'info', 'warning', 'issue', 'critical'];
const rank = (s: Severity) => RANK.indexOf(s);

// GRADE_SEVERITY keys are ordered best to worst
const GRADES = Object.keys(GRADE_SEVERITY);

// Surface the worst SSL Labs endpoint grade for this host
const tlsSecurityAudit: Analyzer = (d) => {
  if (!d || !Array.isArray(d.endpoints) || !d.endpoints.length) return [];
  const grades: string[] = [];
  for (const e of d.endpoints) {
    if (e && typeof e.grade === 'string') grades.push(e.grade);
  }
  if (!grades.length) return [];
  let severity: Severity = 'pass';
  let worstGrade = grades[0];
  for (const g of grades) {
    const sev = GRADE_SEVERITY[g] || 'info';
    if (rank(sev) > rank(severity)) severity = sev;
    if (GRADES.indexOf(g) > GRADES.indexOf(worstGrade)) worstGrade = g;
  }
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
