import type { Analyzer } from '../types';

// Detect a wildcard User-agent followed by a full-site Disallow
const blocksAllCrawlers = (rules: Array<{ lbl: string; val: string }>): boolean => {
  let wildcardActive = false;
  for (const { lbl, val } of rules) {
    const label = lbl?.toLowerCase();
    if (label === 'user-agent') wildcardActive = val?.trim() === '*';
    else if (wildcardActive && label === 'disallow' && val?.trim() === '/') return true;
  }
  return false;
};

// Flag robots.txt rules that hide the site from every crawler
const robotsTxt: Analyzer = (d) => {
  if (!d || !Array.isArray(d.robots) || !d.robots.length) return [];
  if (blocksAllCrawlers(d.robots)) {
    return [
      {
        severity: 'warning',
        title: 'robots.txt blocks every crawler from the entire site',
        detail: 'Confirm this is intentional, otherwise search engines will not index the site',
      },
    ];
  }
  return [];
};

export default robotsTxt;
