const X_USERNAME = /^[A-Za-z0-9_]{1,15}$/;

export const normalizeXUsername = (value: unknown): string | null => {
  if (typeof value !== 'string') return null;
  let candidate = value.trim();
  if (/^https?:\/\//i.test(candidate)) {
    try {
      const parsed = new URL(candidate);
      if (!['x.com', 'www.x.com', 'twitter.com', 'www.twitter.com'].includes(parsed.hostname)) {
        return null;
      }
      const parts = parsed.pathname.split('/').filter(Boolean);
      if (parts.length !== 1) return null;
      candidate = decodeURIComponent(parts[0]);
    } catch {
      return null;
    }
  }
  candidate = candidate.replace(/^@/, '');
  return X_USERNAME.test(candidate) ? candidate : null;
};
