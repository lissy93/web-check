/**
 * Logic for deciding if a check should be skipped, and why.
 * By default all checks are run, but a check will be skipped if:
 * VITE_DISABLE_EVERYTHING is set - turns off the whole instance
 * API_DISABLED_CHECKS - comma seperated list of checks to skip
 * API_ENABLED_CHECKS - comma seperated list of checks to run (all others will be skipped)
 * API_BLOCKED_HOSTS - comma seperated hosts that must never be scanned (domains, IPs or CIDR ranges)
 * Or the target is a private IP and the check needs a public one (like for external API)
 *
 * Note that the get-ip check is probably always needed. Since IP used for most checks.
 */

import { parseTarget } from './parse-target.js';

/* The list of response messages, for the skip reason in API response */
const getSkipMessage = (skipReason, check) => {
  // Check disabled by admin with black/white list
  if (skipReason === 'check-disabled') {
    return `The ${check} check is disabled on this instance.`;
  }
  // The check can't run against private IPs
  if (skipReason === 'private-ip') {
    return `The ${check} check can\'t run for private hosts`;
  }
  // Admin has blocked this host from being scanned
  if (skipReason === 'target-blocked') {
    return 'Scanning this host is not permitted on this instance.';
  }
  // The instance is turned off :(
  if (skipReason === 'instance-fucked') {
    return (
      'This instance of web-check is temporarily disabled.\n' +
      'This is due to excess abuse and bot traffic making hosting unfordable. ' +
      "We're sorry for any inconvenience caused. " +
      'In the meantime, you can self-host your own instance, ' +
      'see instructions in our repo, at: github.com/lissy93/web-check. ' +
      'All checks will continue to fail until the `VITE_DISABLE_EVERYTHING` is unset.'
    );
  }
  // Not sure why this'd happen
  return 'Lookup was skipped for an unknown reason 🤔';
};

/* Gets check ID from the request path (like /api/firewall/ --> firewall) */
const getCheckName = (path) => {
  const name = (path || '').split('?')[0].toLowerCase().split('/').filter(Boolean).pop() || '';
  return name === 'api' ? '' : name.replace(/\.js$/, '');
};

/* Returns array of strings of check IDs from the enable/disable env vars */
const checkListFromEnv = (name) =>
  (process.env[name] || '')
    .toLowerCase()
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

/* Returns true if a given check is disabled with env var */
const isCheckDisabled = (check) => {
  if (!check) return false;
  if (checkListFromEnv('API_DISABLED_CHECKS').includes(check)) return true;
  const enabled = checkListFromEnv('API_ENABLED_CHECKS');
  return enabled.length > 0 && check !== 'get-ip' && !enabled.includes(check);
};

const isEverythingDisabled = () => {
  const value = process.env.VITE_DISABLE_EVERYTHING;
  return !!value && value !== 'false';
};

/* Gets the hostname from the target (minus any trailing dot), or null if it can't be parsed */
const getHost = (target) => {
  try {
    return parseTarget(target).hostname.replace(/\.$/, '');
  } catch {
    return null;
  }
};

/* Matches IPv4 addresses, like 192.168.0.1 */
const ipv4 = /^\d+\.\d+\.\d+\.\d+$/;

/* Turns an IPv4 address into a number, for range comparisons */
const ipToNum = (ip) => ip.split('.').reduce((num, octet) => num * 256 + Number(octet), 0);

/* Returns true if an IPv4 host falls inside a CIDR range (like 192.168.0.0/16) */
const inCidrRange = (host, entry) => {
  const [range, bits] = entry.split('/');
  if (!bits || !ipv4.test(host) || !ipv4.test(range)) return false;
  const mask = -1 << (32 - Number(bits));
  return (ipToNum(host) & mask) === (ipToNum(range) & mask);
};

/* Returns true if the admin has blocked this host with API_BLOCKED_HOSTS */
const isBlockedTarget = (target) => {
  const blocked = checkListFromEnv('API_BLOCKED_HOSTS');
  if (!blocked.length) return false;
  const host = getHost(target);
  if (!host) return false;
  return blocked.some(
    (entry) => host === entry || host.endsWith(`.${entry}`) || inCidrRange(host, entry),
  );
};

/* Checks which send the target to an outside service, so are useless for private hosts */
const publicOnlyChecks = [
  'archives',
  'block-lists',
  'dnssec',
  'location',
  'quality',
  'rank',
  'shodan',
  'subdomains',
  'threats',
  'tls-labs',
  'whois',
];

/* Returns true if the target is a private IP, localhost or a .local address */
const isPrivateTarget = (target) => {
  const host = getHost(target);
  if (!host) return false;
  if (host === 'localhost' || host.endsWith('.local')) return true;
  if (host.includes(':')) return host === '::1' || /^f[cde]/.test(host);
  if (!ipv4.test(host)) return false;
  const [a, b] = host.split('.').map(Number);
  if (a === 10 || a === 127) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 169 && b === 254) return true;
  return a === 100 && b >= 64 && b <= 127;
};

/* Checks every reason a check might not run, returns skip status with a reason */
export const shouldSkip = (path, target) => {
  const check = getCheckName(path);
  if (isEverythingDisabled()) {
    return { skip: true, reason: getSkipMessage('instance-fucked') };
  }
  if (isBlockedTarget(target)) {
    return { skip: true, reason: getSkipMessage('target-blocked') };
  }
  if (isCheckDisabled(check)) {
    return { skip: true, reason: getSkipMessage('check-disabled', check) };
  }
  if (publicOnlyChecks.includes(check) && isPrivateTarget(target)) {
    return { skip: true, reason: getSkipMessage('private-ip', check) };
  }
  return { skip: false };
};
