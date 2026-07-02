// Wrap bare IPv6 in brackets for URL parsing (2+ colons = IPv6)
export const bracketIPv6 = (str) => {
  const bare = str.replace(/^https?:\/\//i, '');
  const host = bare.split('/')[0];
  if (!host.startsWith('[') && (host.match(/:/g) || []).length >= 2)
    return str.replace(host, `[${host}]`);
  return str;
};

// Normalise a user-supplied target, stripping :port for DNS lookups
export const parseTarget = (input) => {
  if (!input) throw new Error('No target provided');
  let normalised = /^https?:\/\//i.test(input) ? input : `https://${input}`;
  normalised = bracketIPv6(normalised);
  let u;
  try {
    u = new URL(normalised);
  } catch {
    throw new Error(`Invalid URL: ${input}`);
  }
  return {
    hostname: u.hostname.replace(/^\[|]$/g, ''),
    port: u.port || null,
    protocol: u.protocol,
    pathname: u.pathname || '/',
    href: u.href,
  };
};

export default parseTarget;
