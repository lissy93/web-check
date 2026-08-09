import type { Analyzer } from '../types';

// Parse Set-Cookie headers (one per array element) into name + attribute list,
// skipping nameless entries (empty lines, cookie-deletion stubs like "=; Path=/")
const parseCookies = (raw: unknown): Array<{ name: string; attrs: string[] }> => {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((line) => {
      const parts = String(line).split(/;\s*/);
      const name = parts[0].split('=')[0].trim();
      const attrs = parts.slice(1).map((p) => p.split('=')[0].trim().toLowerCase());
      return { name, attrs };
    })
    .filter((c) => c.name);
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
