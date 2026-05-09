import type { Analyzer } from '../types';

const LEAK_HEADERS = ['x-powered-by', 'server', 'x-aspnet-version', 'x-aspnetmvc-version'];

// Surface server fingerprint headers as informational findings
const headers: Analyzer = (d) => {
  const out: ReturnType<Analyzer> = [];
  for (const key of LEAK_HEADERS) {
    const val = d[key];
    if (val) {
      out.push({
        severity: 'info',
        title: `Server discloses ${key}`,
        detail: `Value: ${String(val).slice(0, 80)}`,
      });
    }
  }
  return out;
};

export default headers;
