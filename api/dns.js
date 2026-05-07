import dns from 'dns/promises';
import middleware from './_common/middleware.js';
import { parseTarget } from './_common/parse-target.js';

const dnsHandler = async (url) => {
  const { hostname } = parseTarget(url);
  const safe = (fn) => fn.catch(() => []);
  const [a, aaaa, mx, txt, ns, cname, soa, srv, ptr] = await Promise.all([
    safe(dns.resolve4(hostname)),
    safe(dns.resolve6(hostname)),
    safe(dns.resolveMx(hostname)),
    safe(dns.resolveTxt(hostname)),
    safe(dns.resolveNs(hostname)),
    safe(dns.resolveCname(hostname)),
    dns.resolveSoa(hostname).catch(() => null),
    safe(dns.resolveSrv(hostname)),
    safe(dns.resolvePtr(hostname)),
  ]);
  return { A: a, AAAA: aaaa, MX: mx, TXT: txt, NS: ns, CNAME: cname, SOA: soa, SRV: srv, PTR: ptr };
};

export const handler = middleware(dnsHandler);
export default handler;
