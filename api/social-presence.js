import dns from 'dns/promises';
import * as cheerio from 'cheerio';
import middleware from './_common/middleware.js';
import { httpGet } from './_common/http.js';
import { upstreamError } from './_common/upstream.js';
import { parseTarget, baseDomain } from './_common/parse-target.js';
import { safeUrl, hostOf, X_HANDLE, normalizeXHandle } from './_common/social.js';
import { isPrivateTarget } from './_common/check-skipper.js';
import { createLogger } from './_common/logger.js';

const log = createLogger('social-presence');
const TIMEOUT = 8000;
const PAGE_TIMEOUT = 15000;
const MAX_DECLARED = 12;
const MAX_INFERRED = 6;
const PRECEDENCE = { declared: 0, domain: 1, inferred: 2 };

const HOSTNAME = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/;
const GITHUB_USER = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/;
const MASTODON_USER = /^[A-Za-z0-9_]{1,30}$/;

// Profile "website" fields often omit the scheme, so add one before parsing
const asUrl = (value) => (/^https?:\/\//i.test(value) ? value : `https://${value}`);

const sameSite = (url, siteDomain) => {
  const host = url && hostOf(asUrl(url));
  return !!host && baseDomain(host) === siteDomain;
};

const onlyPathSegment = (url) => {
  const parts = url.pathname.split('/').filter(Boolean);
  return parts.length === 1 ? parts[0] : null;
};

// Read the profile metadata X publishes to plain HTTP clients
const parseXProfile = (html, handle) => {
  const $ = cheerio.load(html);
  if ($('meta[property="og:type"]').attr('content') !== 'profile') return null;
  const title = $('meta[property="og:title"]').attr('content') || '';
  const canonical = $('meta[itemprop="url"]').first().attr('content')?.split('/').pop();
  const sameAs = $('meta[itemprop="sameAs"]')
    .map((_, el) => $(el).attr('content'))
    .get();
  const hasCount = $('meta[name="twitter:label1"]').attr('content') === 'Posts';
  return {
    exists: true,
    handle: X_HANDLE.test(canonical || '') ? canonical : handle,
    name: title.replace(/ \(@\w+\) on X$/, '') || undefined,
    avatar: $('meta[property="og:image"]').attr('content'),
    joined: $('meta[itemprop="dateCreated"]').attr('content'),
    count: hasCount ? $('meta[name="twitter:data1"]').attr('content') : undefined,
    website: sameAs.find((url) => hostOf(url) && hostOf(url) !== 'x.com'),
  };
};

// Official oEmbed endpoint, used to tell "no such account" from "could not check"
const confirmX = async (handle) => {
  try {
    const res = await httpGet('https://publish.twitter.com/oembed', {
      params: { url: `https://x.com/${handle}` },
      timeout: TIMEOUT,
    });
    const canonical = res.data?.url?.split('/').pop();
    return X_HANDLE.test(canonical || '') ? { exists: true, handle: canonical } : null;
  } catch (error) {
    if (error.response?.status === 404) return { exists: false, handle };
    throw error;
  }
};

const lookupX = async (handle) => {
  try {
    const res = await httpGet(`https://x.com/${handle}`, { timeout: TIMEOUT });
    const profile = parseXProfile(res.data, handle);
    if (profile) return profile;
  } catch (error) {
    log.debug(`X page fetch failed for @${handle}`, error.message);
  }
  return confirmX(handle);
};

// The JSON lookups only differ by endpoint and field names; a 404 means no such account
const jsonProfile = async (handle, url, opts, map) => {
  try {
    const { data } = await httpGet(url, { timeout: TIMEOUT, ...opts });
    return { exists: true, ...map(data) };
  } catch (error) {
    if ([400, 404].includes(error.response?.status)) return { exists: false, handle };
    throw error;
  }
};

const lookupBluesky = (handle) =>
  jsonProfile(
    handle,
    'https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile',
    { params: { actor: handle } },
    (d) => ({
      handle: d.handle,
      name: d.displayName || undefined,
      avatar: d.avatar,
      joined: d.createdAt,
      count: d.postsCount,
      followers: d.followersCount,
    }),
  );

const fieldUrl = (field) => (field.value?.match(/href="([^"]+)"/) || [])[1];

const transient = (status) => !status || status === 429 || status >= 500;

// Only a definite no returns false; a transient failure throws, so the profile is kept and shown
const isMastodonInstance = async (host) => {
  const addresses = await dns.lookup(host, { all: true });
  if (!addresses.length || addresses.some(({ address }) => isPrivateTarget(address))) return false;
  try {
    const { data } = await httpGet(`https://${host}/api/v1/instance`, {
      timeout: TIMEOUT,
      redirect: 'manual',
    });
    return !!(data?.uri || data?.domain);
  } catch (error) {
    if (transient(error.response?.status)) throw error;
    return false;
  }
};

const lookupMastodon = async (handle, siteDomain) => {
  const [user, instance] = handle.split('@');
  if (!(await isMastodonInstance(instance))) return false;
  return jsonProfile(
    handle,
    `https://${instance}/api/v1/accounts/lookup`,
    { params: { acct: user }, redirect: 'manual' },
    (d) => {
      if (String(d.username || '').toLowerCase() !== user.toLowerCase()) {
        throw new Error('Instance returned a different account');
      }
      const links = (d.fields || [])
        .map((field) => ({ url: fieldUrl(field), verified: !!field.verified_at }))
        .filter((link) => link.url);
      const site = links.find((link) => sameSite(link.url, siteDomain));
      const best = site || links.find((link) => link.verified);
      return {
        handle,
        name: d.display_name || undefined,
        avatar: d.avatar,
        joined: d.created_at,
        count: d.statuses_count,
        followers: d.followers_count,
        website: best?.url,
        websiteVerified: best?.verified || undefined,
      };
    },
  );
};

const lookupGithub = (handle) => {
  const token = process.env.GITHUB_TOKEN;
  return jsonProfile(
    handle,
    `https://api.github.com/users/${handle}`,
    {
      headers: {
        Accept: 'application/vnd.github+json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    },
    (d) => ({
      handle: d.login,
      name: d.name || undefined,
      avatar: d.avatar_url,
      joined: d.created_at,
      count: d.public_repos,
      followers: d.followers,
      website: d.blog || undefined,
    }),
  );
};

const NETWORKS = {
  x: {
    label: 'X',
    url: (handle) => `https://x.com/${handle}`,
    from: (url) => normalizeXHandle(url.href),
    lookup: lookupX,
  },
  bluesky: {
    label: 'Bluesky',
    url: (handle) => `https://bsky.app/profile/${handle}`,
    from: (url) => {
      if (url.hostname !== 'bsky.app') return null;
      const [section, handle] = url.pathname.split('/').filter(Boolean);
      const actor = (handle || '').toLowerCase();
      return section === 'profile' && HOSTNAME.test(actor) ? actor : null;
    },
    lookup: lookupBluesky,
  },
  mastodon: {
    label: 'Mastodon',
    url: (handle) => `https://${handle.split('@')[1]}/@${handle.split('@')[0]}`,
    from: (url) => {
      const segment = onlyPathSegment(url) || '';
      if (!HOSTNAME.test(url.hostname) || !segment.startsWith('@')) return null;
      const user = segment.slice(1);
      return MASTODON_USER.test(user) ? `${user}@${url.hostname}` : null;
    },
    lookup: lookupMastodon,
  },
  github: {
    label: 'GitHub',
    url: (handle) => `https://github.com/${handle}`,
    from: (url) => {
      if (!['github.com', 'www.github.com'].includes(url.hostname)) return null;
      const user = onlyPathSegment(url) || '';
      return GITHUB_USER.test(user) ? user : null;
    },
    lookup: lookupGithub,
  },
};

// Pull every sameAs value out of the page's JSON-LD, however deeply it is nested
const sameAsUrls = ($) => {
  const urls = [];
  const walk = (node) => {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) return node.forEach(walk);
    if (node.sameAs) urls.push(...[].concat(node.sameAs));
    Object.values(node).forEach(walk);
  };
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      walk(JSON.parse($(el).contents().text()));
    } catch {
      log.debug('Skipping malformed JSON-LD block');
    }
  });
  return urls.filter((url) => typeof url === 'string');
};

// Profiles the page points at, tagged by whether the site actually claimed them
const discover = ($) => {
  const found = new Map();
  const add = (value, source) => {
    const url = safeUrl(/^\/\//.test(value) ? `https:${value}` : value);
    if (!url) return;
    for (const [network, spec] of Object.entries(NETWORKS)) {
      const handle = spec.from(url);
      if (!handle) continue;
      const key = `${network}:${handle.toLowerCase()}`;
      if (!found.has(key)) found.set(key, { network, handle, source });
    }
  };

  const xHandle = normalizeXHandle($('meta[name="twitter:site"]').attr('content'));
  if (xHandle) add(`https://x.com/${xHandle}`, 'declared');
  sameAsUrls($).forEach((url) => add(url, 'declared'));
  $('link[rel~="me"], a[rel~="me"]').each((_, el) => add($(el).attr('href'), 'declared'));
  $('a[href^="http"], a[href^="//"]').each((_, el) => add($(el).attr('href'), 'inferred'));

  return [...found.values()];
};

// Returns null when the host turns out not to belong to that network at all
const check = async ({ network, handle, source }, siteDomain) => {
  const spec = NETWORKS[network];
  let profile;
  try {
    profile = await spec.lookup(handle, siteDomain);
  } catch (error) {
    log.debug(`${network} lookup failed for ${handle}`, error.message);
  }
  if (profile === false) return null;
  const base = {
    network: spec.label,
    handle,
    source,
    url: spec.url(handle),
  };
  if (!profile) return { ...base, checked: false };
  const resolved = profile.handle || handle;
  const website = profile.website ? asUrl(profile.website) : undefined;
  return {
    ...base,
    ...profile,
    name: profile.name?.trim() || undefined,
    handle: resolved,
    url: spec.url(resolved),
    website,
    linksBack: website ? sameSite(website, siteDomain) : undefined,
    ...(network === 'bluesky' && resolved === siteDomain && { domainVerified: true }),
  };
};

// A claimed profile is reported either way, but a guessed one has to prove itself
const worthShowing = (profile) => {
  if (profile.source === 'declared') return true;
  if (!profile.exists) return false;
  return !!profile.domainVerified || profile.linksBack === true;
};

const socialPresenceHandler = async (url) => {
  const siteDomain = baseDomain(parseTarget(url).hostname);

  let response;
  try {
    response = await httpGet(url, { timeout: PAGE_TIMEOUT });
  } catch (error) {
    return upstreamError(error, 'Social presence fetch');
  }

  try {
    const discovered = discover(cheerio.load(response.data));
    // A Bluesky handle can be the domain itself, so that is always worth trying
    const found = discovered.some((p) => p.network === 'bluesky')
      ? discovered
      : [...discovered, { network: 'bluesky', handle: siteDomain, source: 'domain' }];
    found.sort((a, b) => PRECEDENCE[a.source] - PRECEDENCE[b.source]);

    // What the site claims about itself is never dropped to make room for a guess
    const claimed = found.filter((p) => p.source !== 'inferred').slice(0, MAX_DECLARED);
    const guessed = found.filter((p) => p.source === 'inferred').slice(0, MAX_INFERRED);
    if (claimed.length + guessed.length < found.length) {
      log.debug(
        `Checking ${claimed.length + guessed.length} of the ${found.length} profiles found`,
      );
    }

    const checked = await Promise.all(
      [...claimed, ...guessed].map((profile) => check(profile, siteDomain)),
    );
    const profiles = checked.filter(Boolean).filter(worthShowing);

    if (!profiles.length) return { skipped: 'No social profiles found for this site' };
    return { domain: siteDomain, profiles };
  } catch (error) {
    return { error: `Failed checking social presence: ${error.message}` };
  }
};

export const handler = middleware(socialPresenceHandler);
export default handler;
