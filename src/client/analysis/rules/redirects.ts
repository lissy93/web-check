import type { Analyzer } from '../types';

// Inspect the HTTP redirect chain for length and HTTPS upgrade
const redirects: Analyzer = (d) => {
  const chain: string[] = Array.isArray(d?.redirects)
    ? d.redirects.filter((u: unknown) => typeof u === 'string')
    : [];
  if (!chain.length) return [];
  const hops = chain.length - 1;
  const out: ReturnType<Analyzer> = [];

  if (hops >= 4) {
    out.push({
      severity: 'warning',
      title: `Long redirect chain: ${hops} hops`,
      detail: 'Collapse intermediate redirects to reduce latency',
    });
  } else if (hops > 0) {
    out.push({ severity: 'info', title: `${hops} redirect hop(s)` });
  }

  const startsHttp = /^http:\/\//i.test(chain[0]);
  const endsHttps = /^https:\/\//i.test(chain[chain.length - 1]);
  if (startsHttp && endsHttps) {
    out.push({ severity: 'pass', title: 'HTTP requests are redirected to HTTPS' });
  } else if (startsHttp && !endsHttps) {
    out.push({
      severity: 'critical',
      title: 'Site does not enforce HTTPS',
      detail: 'Add a permanent redirect from http:// to https://',
    });
  }

  return out;
};

export default redirects;
