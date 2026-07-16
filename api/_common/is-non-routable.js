import dns from 'dns';
import net from 'net';

const PRIVATE_RANGES = [
  { prefix: '10.', mask: null },
  { prefix: '172.', mask: 16, maskBits: 12 },
  { prefix: '192.168.', mask: null },
  { prefix: '127.', mask: null },
  { prefix: '169.254.', mask: null },
  { prefix: '0.', mask: null },
];

const isPrivateIPv4 = (ip) => {
  for (const range of PRIVATE_RANGES) {
    if (range.mask !== null) {
      if (ip.startsWith(range.prefix)) {
        const octets = ip.split('.').map(Number);
        if (octets.length === 4) {
          const ipNum = (octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3];
          const masked = ipNum >>> (32 - range.maskBits);
          const rangeStart = (parseInt(range.prefix.split('.')[0]) << 24) |
            (parseInt(range.prefix.split('.')[1]) << 16);
          const rangeMasked = rangeStart >>> (32 - range.maskBits);
          if (masked === rangeMasked) return true;
        }
      }
    } else if (ip.startsWith(range.prefix)) {
      return true;
    }
  }
  return false;
};

const isPrivateIPv6 = (ip) => {
  const normalized = ip.toLowerCase();
  if (normalized === '::1') return true;
  if (normalized.startsWith('fc') || normalized.startsWith('fd')) return true;
  if (normalized.startsWith('fe8')) return true;
  if (normalized.startsWith('fe9') || normalized.startsWith('fea') || normalized.startsWith('feb')) return true;
  return false;
};

const lookupAsync = (hostname) =>
  new Promise((resolve, reject) => {
    dns.lookup(hostname, (err, ip, family) => {
      if (err) reject(err);
      else resolve({ ip, family });
    });
  });

export const isNonRoutable = async (hostname) => {
  if (net.isIP(hostname)) {
    if (net.isIPv4(hostname)) return isPrivateIPv4(hostname);
    return isPrivateIPv6(hostname);
  }
  try {
    const { ip } = await lookupAsync(hostname);
    if (net.isIPv4(ip)) return isPrivateIPv4(ip);
    return isPrivateIPv6(ip);
  } catch {
    return false;
  }
};

export default isNonRoutable;
