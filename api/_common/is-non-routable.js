import dns from 'dns/promises';
import net from 'net';

const isPrivateIPv4 = (ip) => {
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4) return false;
  // 10.x.x.x
  if (parts[0] === 10) return true;
  // 172.16.x.x - 172.31.x.x
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
  // 192.168.x.x
  if (parts[0] === 192 && parts[1] === 168) return true;
  // 127.x.x.x (loopback)
  if (parts[0] === 127) return true;
  // 169.254.x.x (link-local)
  if (parts[0] === 169 && parts[1] === 254) return true;
  // 0.x.x.x
  if (parts[0] === 0) return true;
  return false;
};

const isPrivateIPv6 = (ip) => {
  const normalized = ip.toLowerCase();
  if (normalized === '::1') return true;
  if (normalized.startsWith('fc') || normalized.startsWith('fd')) return true;
  if (normalized.startsWith('fe8') || normalized.startsWith('fe9')) return true;
  if (normalized.startsWith('fea') || normalized.startsWith('feb')) return true;
  return false;
};

export const isNonRoutable = async (hostname) => {
  if (net.isIP(hostname)) {
    if (net.isIPv4(hostname)) return isPrivateIPv4(hostname);
    return isPrivateIPv6(hostname);
  }
  try {
    const { address } = await dns.lookup(hostname);
    if (net.isIPv4(address)) return isPrivateIPv4(address);
    return isPrivateIPv6(address);
  } catch {
    return false;
  }
};

export default isNonRoutable;
