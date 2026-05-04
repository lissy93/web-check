// Parse a user-supplied target into a normalised form.
// Strips protocol/port/path so DNS-touching endpoints get a bare hostname.
export const parseTarget = (input) => {
  if (!input) throw new Error('No target provided');
  const normalised = /^https?:\/\//i.test(input) ? input : `https://${input}`;
  let u;
  try { u = new URL(normalised); }
  catch (err) { throw new Error(`Invalid URL: ${input}`); }
  return {
    hostname: u.hostname,
    port: u.port || null,
    protocol: u.protocol,
    pathname: u.pathname || '/',
    href: u.href,
  };
};

export default parseTarget;
