// Normalise a user-supplied target, stripping :port for DNS lookups.
export const parseTarget = (input) => {
  if (!input) throw new Error('No target provided');
  const normalised = /^https?:\/\//i.test(input) ? input : `https://${input}`;
  let u;
  try { u = new URL(normalised); }
  catch { throw new Error(`Invalid URL: ${input}`); }
  return {
    hostname: u.hostname,
    port: u.port || null,
    protocol: u.protocol,
    pathname: u.pathname || '/',
    href: u.href,
  };
};

export default parseTarget;
