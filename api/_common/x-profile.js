const X_HOSTS = new Set(['x.com', 'www.x.com', 'twitter.com', 'www.twitter.com']);
const X_USERNAME = /^[A-Za-z0-9_]{1,15}$/;

export const extractXUsername = (targetUrl) => {
  let parsed;
  try {
    parsed = new URL(targetUrl);
  } catch {
    return null;
  }
  if (!X_HOSTS.has(parsed.hostname.toLowerCase())) return null;
  const parts = parsed.pathname.split('/').filter(Boolean);
  if (parts.length !== 1) return null;
  let username;
  try {
    username = decodeURIComponent(parts[0]).replace(/^@/, '');
  } catch {
    return null;
  }
  return X_USERNAME.test(username) ? username : null;
};

const optionalString = (value, maxLength) =>
  typeof value === 'string' && value.length <= maxLength ? value : undefined;

const optionalCount = (value) => (Number.isSafeInteger(value) && value >= 0 ? value : undefined);

export const projectXProfile = (profile, requestedUsername) => {
  if (!profile || typeof profile !== 'object') return null;
  const id = optionalString(profile.id, 32);
  const username = optionalString(profile.username, 15);
  const name = optionalString(profile.name, 100);
  if (!id || !username || !name || username.toLowerCase() !== requestedUsername.toLowerCase()) {
    return null;
  }
  return {
    id,
    username,
    name,
    description: optionalString(profile.description, 1000),
    followers: optionalCount(profile.followers),
    following: optionalCount(profile.following),
    statusesCount: optionalCount(profile.statusesCount),
    verified: typeof profile.verified === 'boolean' ? profile.verified : undefined,
    location: optionalString(profile.location, 100),
  };
};

export const lookupXProfile = async ({ targetUrl, apiKey, get }) => {
  if (!apiKey) return { skipped: 'Xquik profile lookup requires XQUIK_API_KEY to be set' };
  const username = extractXUsername(targetUrl);
  if (!username) return { error: 'Use one X profile URL with a valid username' };
  const response = await get(`https://xquik.com/api/v1/x/users/${encodeURIComponent(username)}`, {
    headers: { 'x-api-key': apiKey },
    timeout: 15000,
  });
  const profile = projectXProfile(response.data, username);
  if (!profile) return { error: `Xquik returned a profile that did not match @${username}` };
  return profile;
};
