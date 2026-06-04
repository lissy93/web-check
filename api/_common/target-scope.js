import net from 'net';

const IPV4_RANGES = [
  ['10.0.0.0', '10.255.255.255'],
  ['127.0.0.0', '127.255.255.255'],
  ['169.254.0.0', '169.254.255.255'],
  ['172.16.0.0', '172.31.255.255'],
  ['192.168.0.0', '192.168.255.255'],
  ['0.0.0.0', '0.255.255.255'],
];

const ipv4ToInt = (ip) =>
  ip
    .split('.')
    .map((part) => parseInt(part, 10))
    .reduce((acc, part) => (acc << 8) + part, 0) >>> 0;

const isPrivateIpv4 = (ip) => {
  const value = ipv4ToInt(ip);
  return IPV4_RANGES.some(([start, end]) => {
    const lower = ipv4ToInt(start);
    const upper = ipv4ToInt(end);
    return value >= lower && value <= upper;
  });
};

const isPrivateIpv6 = (ip) => {
  const normalized = ip.toLowerCase();
  return (
    normalized === '::1' ||
    normalized.startsWith('fc') ||
    normalized.startsWith('fd') ||
    normalized.startsWith('fe80:')
  );
};

export const isNonRoutableHost = (hostname) => {
  if (!hostname) return false;
  if (hostname === 'localhost' || hostname.endsWith('.localhost')) return true;

  const ipVersion = net.isIP(hostname);
  if (ipVersion === 4) return isPrivateIpv4(hostname);
  if (ipVersion === 6) return isPrivateIpv6(hostname);
  return false;
};

export const skipIfNonRoutable = (hostname, serviceName) => {
  if (!isNonRoutableHost(hostname)) return null;
  return {
    skipped: `${serviceName} only runs against publicly routable hosts`,
    reason: 'non-routable-host',
    hostname,
  };
};
