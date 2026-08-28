import dns from 'node:dns';
import dnsPromises from 'node:dns/promises';
import http from 'node:http';
import https from 'node:https';
import net from 'node:net';

const DEFAULT_METADATA_HOSTS = [
  'metadata',
  'metadata.google.internal',
  'metadata.google.internal.',
  'metadata.azure.internal',
  'metadata.azure.internal.',
  'metadata.aws.internal',
  'instance-data.ec2.internal',
  'instance-data',
  'metadata.tencentyun.com',
  'metadata.tencentcloud.com',
  'metadata.oraclecloud.com',
  'metadata.oci.oraclecloud.com',
  'metadata.myhuaweicloud.com',
  'metadata.huaweicloud.com',
  'metadata.aliyun.internal',
  'metadata.digitalocean.com',
  'metadata.linode.com',
  'metadata.vultr.com',
  'metadata.ibmcloud.com',
  'metadata.openstack.org',
  'metadata.packet.net',
];

const DEFAULT_METADATA_IPS = [
  '169.254.169.254', // AWS/GCP/Azure/OCI/OpenStack/DigitalOcean
  '169.254.169.253', // GCP (legacy)
  '169.254.169.250', // Oracle (legacy)
  '100.100.100.200', // Alibaba Cloud
  '100.100.100.201', // Alibaba Cloud (secondary)
  'fd00:ec2::254', // AWS IPv6 IMDS
];

const parseEnvList = (value) => {
  if (!value) return [];
  return value
    .split(',')
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
};

const normalizeHostname = (hostname) =>
  hostname
    .toLowerCase()
    .replace(/^\[|\]$/g, '')
    .replace(/\.$/, '');

const METADATA_HOSTS = new Set(
  [...DEFAULT_METADATA_HOSTS, ...parseEnvList(process.env.SSRF_METADATA_HOSTS)].map(
    normalizeHostname,
  ),
);

const METADATA_IPS = new Set(
  [...DEFAULT_METADATA_IPS, ...parseEnvList(process.env.SSRF_METADATA_IPS)].map(normalizeHostname),
);

const IPV4_BLOCK_SUBNETS = [
  ['0.0.0.0', 8],
  ['10.0.0.0', 8],
  ['100.64.0.0', 10],
  ['127.0.0.0', 8],
  ['169.254.0.0', 16],
  ['172.16.0.0', 12],
  ['192.0.0.0', 24],
  ['192.0.2.0', 24],
  ['192.88.99.0', 24],
  ['192.168.0.0', 16],
  ['198.18.0.0', 15],
  ['198.51.100.0', 24],
  ['203.0.113.0', 24],
  ['224.0.0.0', 4],
  ['240.0.0.0', 4],
];

const IPV6_BLOCK_SUBNETS = [
  ['::', 128],
  ['::1', 128],
  ['64:ff9b::', 96],
  ['64:ff9b:1::', 48],
  ['100::', 64],
  ['100:0:0:1::', 64],
  ['2001::', 23],
  ['2001:db8::', 32],
  ['2002::', 16],
  ['3fff::', 20],
  ['5f00::', 16],
  ['fc00::', 7],
  ['fe80::', 10],
  ['ff00::', 8],
];

const blockedAddresses = new net.BlockList();
IPV4_BLOCK_SUBNETS.forEach(([address, prefix]) =>
  blockedAddresses.addSubnet(address, prefix, 'ipv4'),
);
IPV6_BLOCK_SUBNETS.forEach(([address, prefix]) =>
  blockedAddresses.addSubnet(address, prefix, 'ipv6'),
);

const privateTargetsAllowed = () => process.env.ALLOW_PRIVATE_TARGETS === 'true';

const isPrivateIp = (ip) => {
  const normalized = normalizeHostname(ip);
  if (METADATA_IPS.has(normalized)) {
    return true;
  }

  if (net.isIPv4(normalized)) {
    return blockedAddresses.check(normalized, 'ipv4');
  }
  if (net.isIPv6(normalized)) {
    return blockedAddresses.check(normalized, 'ipv6');
  }

  return true;
};

const isDisallowedHostname = (hostname) => {
  const normalized = normalizeHostname(hostname);
  if (METADATA_HOSTS.has(normalized)) return true;
  if (normalized === 'localhost' || normalized.endsWith('.localhost')) return true;
  if (normalized.endsWith('.local') || normalized.endsWith('.localdomain')) return true;
  if (normalized.endsWith('.internal')) return true;
  return false;
};

const resolveAndCheck = async (hostname, lookup) => {
  const records = await lookup(hostname, { all: true });
  if (!records.length) {
    throw new Error('Host resolves to no addresses');
  }

  for (const record of records) {
    if (isPrivateIp(record.address)) {
      throw new Error('Host resolves to a private or metadata address');
    }
  }
};

const originalLookup = dns.lookup.bind(dns);

export const safeLookup = (hostname, options, callback) => {
  const opts =
    typeof options === 'number'
      ? { family: options }
      : typeof options === 'function'
        ? {}
        : options || {};
  const cb = typeof options === 'function' ? options : callback;

  if (privateTargetsAllowed()) {
    return typeof options === 'function'
      ? originalLookup(hostname, options)
      : originalLookup(hostname, options, callback);
  }

  originalLookup(hostname, { ...opts, all: true }, (error, addresses) => {
    if (error) {
      cb(error);
      return;
    }

    if (!addresses || addresses.length === 0) {
      cb(new Error('Host resolves to no addresses'));
      return;
    }

    for (const record of addresses) {
      if (isPrivateIp(record.address)) {
        cb(new Error('Host resolves to a private or metadata address'));
        return;
      }
    }

    if (opts.all) {
      cb(null, addresses);
      return;
    }

    cb(null, addresses[0].address, addresses[0].family);
  });
};

const extractHostname = (input, options) => {
  if (input instanceof URL) {
    return normalizeHostname(input.hostname);
  }

  if (typeof input === 'string') {
    try {
      return normalizeHostname(new URL(input).hostname);
    } catch (_) {
      return null;
    }
  }

  const fromOptions = options && typeof options === 'object' ? options : input || {};
  let host = fromOptions.hostname || fromOptions.host || null;
  if (!host) return null;

  if (host.startsWith('[') && host.includes(']')) {
    host = host.slice(1, host.indexOf(']'));
  } else if (!net.isIP(host) && host.indexOf(':') === host.lastIndexOf(':')) {
    host = host.split(':')[0];
  }

  return normalizeHostname(host);
};

const parseRequestTarget = (input, options) => {
  if (input instanceof URL) {
    return {
      hostname: normalizeHostname(input.hostname),
      pathname: input.pathname,
      port: input.port || '',
    };
  }

  if (typeof input === 'string') {
    try {
      const parsed = new URL(input);
      return {
        hostname: normalizeHostname(parsed.hostname),
        pathname: parsed.pathname,
        port: parsed.port || '',
      };
    } catch (_) {
      return null;
    }
  }

  const fromOptions = options && typeof options === 'object' ? options : input || {};
  const hostname = fromOptions.hostname || fromOptions.host || null;
  const pathname = fromOptions.path || '/';
  const port = fromOptions.port ? String(fromOptions.port) : '';
  return hostname ? { hostname: extractHostname(fromOptions), pathname, port } : null;
};

const isDevtoolsRequest = (input, options) => {
  const target = parseRequestTarget(input, options);
  if (!target) return false;

  const host = target.hostname;
  if (!host || !(host === '127.0.0.1' || host === '::1' || host === 'localhost')) {
    return false;
  }

  const path = target.pathname || '/';
  return path.startsWith('/json') || path.startsWith('/devtools');
};

const assertSafeHostSync = (hostname, input, options) => {
  if (!hostname || privateTargetsAllowed()) return;
  if (isDisallowedHostname(hostname)) {
    throw new Error('URL hostname is blocked');
  }
  if (net.isIP(hostname) && isPrivateIp(hostname)) {
    if (isDevtoolsRequest(input, options)) {
      return;
    }
    throw new Error('URL resolves to a private or metadata address');
  }
};

let guardsInstalled = false;
const originalFns = {
  httpRequest: http.request.bind(http),
  httpsRequest: https.request.bind(https),
  httpGet: http.get.bind(http),
  httpsGet: https.get.bind(https),
};

export const installSsrfGuards = () => {
  if (guardsInstalled) return;
  guardsInstalled = true;

  dns.lookup = safeLookup;

  const wrapRequest =
    (original) =>
    (...args) => {
      const hostname = extractHostname(args[0], args[1]);
      assertSafeHostSync(hostname, args[0], args[1]);
      return original(...args);
    };

  http.request = wrapRequest(originalFns.httpRequest);
  https.request = wrapRequest(originalFns.httpsRequest);
  http.get = wrapRequest(originalFns.httpGet);
  https.get = wrapRequest(originalFns.httpsGet);
};

export const assertSafeUrl = async (rawUrl, lookup = dnsPromises.lookup) => {
  let parsed;
  try {
    parsed = new URL(rawUrl);
  } catch (error) {
    throw new Error('URL provided is invalid');
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error('URL scheme not allowed');
  }

  if (parsed.username || parsed.password) {
    throw new Error('URL credentials are not allowed');
  }

  const hostname = normalizeHostname(parsed.hostname);
  if (!hostname) {
    throw new Error('URL hostname is missing');
  }

  if (privateTargetsAllowed()) {
    return parsed.toString();
  }

  if (isDisallowedHostname(hostname)) {
    throw new Error('URL hostname is blocked');
  }

  if (net.isIP(hostname)) {
    if (isPrivateIp(hostname)) {
      throw new Error('URL resolves to a private or metadata address');
    }
    return parsed.toString();
  }

  await resolveAndCheck(hostname, lookup);

  return parsed.toString();
};
