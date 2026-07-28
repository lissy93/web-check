// Centralised SSRF guard for the API middleware.
//
// Every API endpoint is invoked through `commonMiddleware` with a user-supplied
// `?url=` query parameter that ends up being passed to http clients, DNS
// resolvers, raw TCP sockets and headless Chromium. Without validation an
// attacker can pivot the public instance into the operator's internal network
// (e.g. cloud metadata services on 169.254.169.254, LAN ranges, loopback).
//
// `assertSafeTarget` enforces:
//   * the URL parses
//   * the scheme is http(s) — file:, gopher:, ftp: etc. are rejected
//   * the resolved IP (or IP literal) is not in a private / reserved / loopback
//     / link-local / multicast / CGNAT range, for either v4 or v6
//
// Self-hosters who legitimately want to scan their own LAN can opt out via
// `ALLOW_PRIVATE_TARGETS=true` in their .env.

import { BlockList, isIP } from 'net';
import { promises as dns } from 'dns';

const ALLOW_PRIVATE = /^(1|true|yes)$/i.test(process.env.ALLOW_PRIVATE_TARGETS || '');

// Build a BlockList covering the address space we never want web-check to
// reach from a public deployment. Mirrors the IANA special-purpose registries.
//
// Note: Node's BlockList transparently handles IPv4-mapped IPv6 addresses
// (e.g. `::ffff:127.0.0.1` matches the `127.0.0.0/8` v4 rule), so we don't
// add an explicit `::ffff:0:0/96` subnet — doing so would block every v4
// address by accident.
const buildBlockList = () => {
  const bl = new BlockList();
  // IPv4
  bl.addSubnet('0.0.0.0', 8); // "this network" / unspecified
  bl.addSubnet('10.0.0.0', 8); // RFC1918
  bl.addSubnet('100.64.0.0', 10); // CGNAT
  bl.addSubnet('127.0.0.0', 8); // loopback
  bl.addSubnet('169.254.0.0', 16); // link-local / cloud metadata
  bl.addSubnet('172.16.0.0', 12); // RFC1918
  bl.addSubnet('192.0.0.0', 24); // IETF protocol assignments
  bl.addSubnet('192.0.2.0', 24); // TEST-NET-1
  bl.addSubnet('192.168.0.0', 16); // RFC1918
  bl.addSubnet('198.18.0.0', 15); // benchmarking
  bl.addSubnet('198.51.100.0', 24); // TEST-NET-2
  bl.addSubnet('203.0.113.0', 24); // TEST-NET-3
  bl.addSubnet('224.0.0.0', 4); // multicast
  bl.addSubnet('240.0.0.0', 4); // reserved
  bl.addAddress('255.255.255.255'); // broadcast
  // IPv6
  bl.addAddress('::', 'ipv6'); // unspecified
  bl.addAddress('::1', 'ipv6'); // loopback
  bl.addSubnet('fc00::', 7, 'ipv6'); // unique local
  bl.addSubnet('fe80::', 10, 'ipv6'); // link-local
  bl.addSubnet('ff00::', 8, 'ipv6'); // multicast
  bl.addSubnet('64:ff9b::', 96, 'ipv6'); // v4/v6 translation
  bl.addSubnet('2001:db8::', 32, 'ipv6'); // documentation
  return bl;
};

const blocklist = buildBlockList();

// An error type the middleware can recognise to return HTTP 400 rather than 500.
export class UnsafeTargetError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnsafeTargetError';
    this.code = 'UNSAFE_TARGET';
  }
}

// Reject anything that resolves to (or literally is) a private/reserved address.
const checkAddress = (address) => {
  const family = isIP(address) === 6 ? 'ipv6' : 'ipv4';
  return !blocklist.check(address, family);
};

// Resolve `hostname` and ensure none of the returned addresses are private.
// We check *all* addresses (not just the first) to defeat DNS records that
// mix a public and a private answer.
const resolveAndCheck = async (hostname) => {
  if (isIP(hostname)) {
    if (!checkAddress(hostname)) {
      throw new UnsafeTargetError(
        `Target ${hostname} resolves to a private or reserved address and is not allowed.`,
      );
    }
    return;
  }
  let addresses;
  try {
    addresses = await dns.lookup(hostname, { all: true });
  } catch {
    // Let the downstream handler surface the DNS failure in its usual envelope.
    return;
  }
  for (const { address } of addresses) {
    if (!checkAddress(address)) {
      throw new UnsafeTargetError(
        `Target ${hostname} resolves to a private or reserved address (${address}) and is not allowed.`,
      );
    }
  }
};

// Public entry point — called by the middleware before invoking any handler.
// Throws `UnsafeTargetError` for disallowed targets; returns silently otherwise.
export const assertSafeTarget = async (rawUrl) => {
  if (ALLOW_PRIVATE) return;

  let parsed;
  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new UnsafeTargetError(`Invalid URL: ${rawUrl}`);
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new UnsafeTargetError(
      `Unsupported URL scheme "${parsed.protocol}". Only http and https are allowed.`,
    );
  }

  // `URL` brackets IPv6 hostnames — strip them before passing to net/dns.
  const hostname = parsed.hostname.replace(/^\[|]$/g, '');
  if (!hostname) {
    throw new UnsafeTargetError('URL is missing a hostname.');
  }

  await resolveAndCheck(hostname);
};

export default assertSafeTarget;
