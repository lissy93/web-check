const dns = require('dns');
const util = require('util');
const middleware = require('./_common/middleware');

const handler = async (url) => {
  let hostname = url;

  // Handle URLs by extracting hostname
  if (hostname.startsWith('http://') || hostname.startsWith('https://')) {
    hostname = new URL(hostname).hostname;
  }

  try {
    const lookupPromise = util.promisify(dns.lookup);
    const resolve4Promise = util.promisify(dns.resolve4);
    const resolve6Promise = util.promisify(dns.resolve6);
    const resolveMxPromise = util.promisify(dns.resolveMx);
    const resolveTxtPromise = util.promisify(dns.resolveTxt);
    const resolveNsPromise = util.promisify(dns.resolveNs);
    const resolveCnamePromise = util.promisify(dns.resolveCname);
    const resolveSoaPromise = util.promisify(dns.resolveSoa);
    const resolveSrvPromise = util.promisify(dns.resolveSrv);
    const resolvePtrPromise = util.promisify(dns.resolvePtr);

    const [a, aaaa, mx, txt, ns, cname, soa, srv, ptr] = await Promise.all([
      lookupPromise(hostname),
      resolve4Promise(hostname).catch(() => []), // A record
      resolve6Promise(hostname).catch(() => []), // AAAA record
      resolveMxPromise(hostname).catch(() => []), // MX record
      resolveTxtPromise(hostname).catch(() => []), // TXT record
      resolveNsPromise(hostname).catch(() => []), // NS record
      resolveCnamePromise(hostname).catch(() => []), // CNAME record
      resolveSoaPromise(hostname).catch(() => []), // SOA record
      resolveSrvPromise(hostname).catch(() => []), // SRV record
      resolvePtrPromise(hostname).catch(() => [])  // PTR record
    ]);

    return {
      A: a,
      AAAA: aaaa,
      MX: mx,
      TXT: txt,
      NS: ns,
      CNAME: cname,
      SOA: soa,
      SRV: srv,
      PTR: ptr
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = middleware(handler);
module.exports.handler = middleware(handler);
