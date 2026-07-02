import type { Analyzer } from '../types';

const CRITICAL: Array<[string, string]> = [
  ['contentSecurityPolicy', 'Content-Security-Policy'],
  ['strictTransportPolicy', 'Strict-Transport-Security'],
  ['xContentTypeOptions', 'X-Content-Type-Options'],
  ['xFrameOptions', 'X-Frame-Options'],
];

const RECOMMENDED: Array<[string, string]> = [
  ['referrerPolicy', 'Referrer-Policy'],
  ['permissionsPolicy', 'Permissions-Policy'],
  ['crossOriginOpenerPolicy', 'Cross-Origin-Opener-Policy'],
  ['crossOriginResourcePolicy', 'Cross-Origin-Resource-Policy'],
  ['crossOriginEmbedderPolicy', 'Cross-Origin-Embedder-Policy'],
];

// Flag missing critical headers as issues, missing recommended as warnings
const httpSecurity: Analyzer = (d) => {
  const out: ReturnType<Analyzer> = [];
  for (const [key, label] of CRITICAL) {
    out.push(
      d[key]
        ? { severity: 'pass', title: `${label} set` }
        : {
            severity: 'issue',
            title: `Missing ${label}`,
            detail: `Set the ${label} response header`,
          },
    );
  }
  for (const [key, label] of RECOMMENDED) {
    if (!d[key]) {
      out.push({
        severity: 'warning',
        title: `Missing ${label}`,
        detail: `Consider adding the ${label} response header`,
      });
    }
  }
  return out;
};

export default httpSecurity;
