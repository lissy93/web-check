import dns from 'dns';
import middleware from './_common/middleware.js';
import { parseTarget } from './_common/parse-target.js';

const DNS_SERVERS = [
  { name: 'AdGuard', ip: '176.103.130.130' },
  { name: 'AdGuard Family', ip: '176.103.130.132' },
  { name: 'CleanBrowsing Adult', ip: '185.228.168.10' },
  { name: 'CleanBrowsing Family', ip: '185.228.168.168' },
  { name: 'CleanBrowsing Security', ip: '185.228.168.9' },
  { name: 'CloudFlare', ip: '1.1.1.1' },
  { name: 'CloudFlare Family', ip: '1.1.1.3' },
  { name: 'Comodo Secure', ip: '8.26.56.26' },
  { name: 'Google DNS', ip: '8.8.8.8' },
  { name: 'OpenDNS', ip: '208.67.222.222' },
  { name: 'OpenDNS Family', ip: '208.67.222.123' },
  { name: 'Quad9', ip: '9.9.9.9' },
];

// Sink IPs used by blocking DNS servers
const SINK_IPS = new Set(['0.0.0.0', '127.0.0.1', '::1', '::', '0:0:0:0:0:0:0:0']);

// Resolve a domain via a specific DNS server
const queryServer = (domain, serverIp) =>
  new Promise((resolve) => {
    const resolver = new dns.Resolver({ timeout: 3000, tries: 1 });
    resolver.setServers([serverIp]);
    resolver.resolve4(domain, (err, addrs) => {
      if (err) return resolve({ err: err.code });
      resolve({ addrs });
    });
  });

// A domain is blocked if the resolver returns a sink IP or refuses
// to resolve a domain that a neutral resolver can resolve
const isBlocked = (result, refResolved) => {
  if (!refResolved) return false;
  if (result.err === 'NXDOMAIN' || result.err === 'SERVFAIL') return true;
  if (!result.addrs) return false;
  return result.addrs.every((ip) => SINK_IPS.has(ip));
};

const blockListHandler = async (url) => {
  const { hostname: domain } = parseTarget(url);
  const ref = await queryServer(domain, '8.8.8.8');
  const refResolved = !!ref.addrs?.length;

  const results = await Promise.all(
    DNS_SERVERS.map(async ({ name, ip }) => {
      const result = await queryServer(domain, ip);
      return {
        server: name,
        serverIp: ip,
        isBlocked: isBlocked(result, refResolved),
      };
    }),
  );
  return { blocklists: results };
};

export const handler = middleware(blockListHandler);
export default handler;
