import type { Analyzer, Severity } from '../types';

const LABELS: Record<string, string> = {
  performance: 'Performance',
  accessibility: 'Accessibility',
  'best-practices': 'Best Practices',
  seo: 'SEO',
  pwa: 'PWA',
};

// Convert a 0..1 lighthouse score to a severity bucket
const scoreSeverity = (score: number): Severity => {
  if (score >= 0.9) return 'pass';
  if (score >= 0.7) return 'info';
  if (score >= 0.5) return 'warning';
  return 'issue';
};

// One finding per Lighthouse category, mirroring the score colour
const quality: Analyzer = (d) => {
  const cats = d?.categories;
  if (!cats || typeof cats !== 'object') return [];
  const out: ReturnType<Analyzer> = [];
  for (const [key, label] of Object.entries(LABELS)) {
    const score = cats[key]?.score;
    if (typeof score !== 'number') continue;
    const pct = Math.round(score * 100);
    out.push({
      severity: scoreSeverity(score),
      title: `${label} score: ${pct}`,
      detail:
        score < 0.9 ? `Lighthouse flagged ${label.toLowerCase()} as below recommended` : undefined,
    });
  }
  return out;
};

export default quality;
