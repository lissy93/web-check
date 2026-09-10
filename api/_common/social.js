// Reading social profile handles out of the markup a site publishes about itself

const X_HOSTS = ['x.com', 'www.x.com', 'twitter.com', 'www.twitter.com'];

export const X_HANDLE = /^[A-Za-z0-9_]{1,15}$/;

export const safeUrl = (value) => {
  try {
    return new URL(value);
  } catch {
    return null;
  }
};

export const hostOf = (value) => safeUrl(value)?.hostname;

// Turn a twitter:site value (@handle, handle or profile URL) into a bare handle
export const normalizeXHandle = (value) => {
  if (typeof value !== 'string') return null;
  let handle = value.trim();
  if (/^https?:\/\//i.test(handle)) {
    const parsed = safeUrl(handle);
    if (!parsed || !X_HOSTS.includes(parsed.hostname)) return null;
    const parts = parsed.pathname.split('/').filter(Boolean);
    if (parts.length !== 1) return null;
    handle = parts[0];
  }
  handle = handle.replace(/^@/, '');
  return X_HANDLE.test(handle) ? handle : null;
};
