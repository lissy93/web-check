const dns = require('dns');
const { URL } = require('url');
const middleware = require('./_common/middleware');

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
  { name: 'Neustar Family', ip: '156.154.70.3' },
  { name: 'Neustar Protection', ip: '156.154.70.2' },
  { name: 'Norton Family', ip: '199.85.126.20' },
  { name: 'OpenDNS', ip: '208.67.222.222' },
  { name: 'OpenDNS Family', ip: '208.67.222.123' },
  { name: 'Quad9', ip: '9.9.9.9' },
  { name: 'Yandex Family', ip: '77.88.8.7' },
  { name: 'Yandex Safe', ip: '77.88.8.88' },
];
const knownBlockIPs = [
  '146.112.61.106', // OpenDNS
  '185.228.168.10', // CleanBrowsing
  '8.26.56.26',     // Comodo
  '9.9.9.9',        // Quad9
  '208.69.38.170',  // Some OpenDNS IPs
  '208.69.39.170',  // Some OpenDNS IPs
  '208.67.222.222', // OpenDNS
  '208.67.222.123', // OpenDNS FamilyShield
  '199.85.126.10',  // Norton
  '199.85.126.20',  // Norton Family
  '156.154.70.22',  // Neustar
  '77.88.8.7',      // Yandex
  '77.88.8.8',      // Yandex
  '::1',              // Localhost IPv6
  '2a02:6b8::feed:0ff', // Yandex DNS
  '2a02:6b8::feed:bad', // Yandex Safe
  '2a02:6b8::feed:a11', // Yandex Family
  '2620:119:35::35',    // OpenDNS
  '2620:119:53::53',    // OpenDNS FamilyShield
  '2606:4700:4700::1111', // Cloudflare
  '2606:4700:4700::1001', // Cloudflare
  '2001:4860:4860::8888', // Google DNS
  '2a0d:2a00:1::',        // AdGuard
  '2a0d:2a00:2::'         // AdGuard Family
];

const isDomainBlocked = async (domain, serverIP) => {
  return new Promise((resolve) => {
    dns.resolve4(domain, { server: serverIP }, (err, addresses) => {
      if (!err) {
        if (addresses.some(addr => knownBlockIPs.includes(addr))) {
          resolve(true);
          return;
        }
        resolve(false);
        return;
      }

      dns.resolve6(domain, { server: serverIP }, (err6, addresses6) => {
        if (!err6) {
          if (addresses6.some(addr => knownBlockIPs.includes(addr))) {
            resolve(true);
            return;
          }
          resolve(false);
          return;
        }
        if (err6.code === 'ENOTFOUND' || err6.code === 'SERVFAIL') {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  });
};

const checkDomainAgainstDnsServers = async (domain) => {
  let results = [];

  for (let server of DNS_SERVERS) {
    const isBlocked = await isDomainBlocked(domain, server.ip);
    results.push({
      server: server.name,
      serverIp: server.ip,
      isBlocked,
    });
  }

  return results;
};

const handler = async (url) => {
  const domain = new URL(url).hostname;
  const results = await checkDomainAgainstDnsServers(domain);
  return { blocklists: results };
};

module.exports = middleware(handler);
module.exports.handler = middleware(handler);

