import type { Analyzer } from '../types';

// Parse Set-Cookie headers into name + attribute map (analysis-local copy)
const parseCookies = (raw: unknown): Array<{ name: string; attrs: string[] }> => {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((line) =>
    String(line)
      .split(/,(?=\s[A-Za-z0-9]+=)/)
      .map((cookie) => {
        const parts = cookie.split('; ').map((p) => p.trim());
        const name = parts[0]?.split('=')[0] || 'cookie';
        const attrs = parts.slice(1).map((p) => p.split('=')[0].toLowerCase());
        return { name, attrs };
      }),
  );
};

// Audit Set-Cookie attributes for Secure, HttpOnly, SameSite
const cookies: Analyzer = (d) => {
  const parsed = parseCookies(d.headerCookies);
  if (!parsed.length) return [];
  const out: ReturnType<Analyzer> = [];
  for (const { name, attrs } of parsed) {
    if (!attrs.includes('secure')) {
      out.push({ severity: 'issue', title: `Cookie "${name}" missing Secure flag` });
    }
    if (!attrs.includes('httponly')) {
      out.push({ severity: 'warning', title: `Cookie "${name}" missing HttpOnly flag` });
    }
    if (!attrs.includes('samesite')) {
      out.push({ severity: 'warning', title: `Cookie "${name}" missing SameSite flag` });
    }
  }
  if (!out.length)
    out.push({ severity: 'pass', title: 'All cookies use Secure/HttpOnly/SameSite' });
  return out;
};

export default cookies;
