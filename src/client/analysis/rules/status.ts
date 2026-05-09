import type { Analyzer } from '../types';

const SLOW_MS = 2000;
const VERY_SLOW_MS = 5000;

// Reachability + latency. Non-success codes never reach here, the API throws
const status: Analyzer = (d) => {
  const out: ReturnType<Analyzer> = [];
  const code = Number(d.responseCode);
  if (Number.isFinite(code)) {
    out.push({ severity: 'pass', title: `Site responded with ${code}` });
  }
  const t = Number(d.responseTime);
  if (Number.isFinite(t)) {
    if (t >= VERY_SLOW_MS) {
      out.push({
        severity: 'warning',
        title: `Slow response time: ${Math.round(t)}ms`,
        detail: 'Investigate server performance, caching or CDN coverage',
      });
    } else if (t >= SLOW_MS) {
      out.push({ severity: 'info', title: `Response time over ${SLOW_MS}ms` });
    }
  }
  return out;
};

export default status;
