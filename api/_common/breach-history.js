// Looks up whether the site's own operator has appeared in a catalogued data
// breach, using the public Have I Been Pwned breach catalogue. This is the
// domain-level catalogue only — no account, email or password is ever sent.

import psl from 'psl';
import { UA, httpGet } from './http.js';

const HIBP_BREACHES = 'https://haveibeenpwned.com/api/v3/breaches';
const HIBP_TIMEOUT = 8000;
const REDIRECT_TIMEOUT = 5000;

// HIBP data is published under CC BY 4.0, so attribution travels with the data
export const HIBP_SOURCE = {
  name: 'Have I Been Pwned',
  url: 'https://haveibeenpwned.com',
  license: 'CC BY 4.0',
  licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
};

// Anything that hands an attacker the account itself, money, or a legal identity
const CRITICAL_CLASSES = new Set([
  'passwords',
  'historical passwords',
  'security questions and answers',
  'auth tokens',
  'encrypted keys',
  'pins',
  'credit cards',
  'credit card cvv',
  'bank account numbers',
  'government issued ids',
  'passport numbers',
  'social security numbers',
  'biometric data',
]);

// Anything that makes a convincing targeted attack, or that is sensitive in law
const HIGH_CLASSES = new Set([
  'password hints',
  'partial credit card data',
  'dates of birth',
  'physical addresses',
  'phone numbers',
  'private messages',
  'email messages',
  'chat logs',
  'account balances',
  'payment histories',
  'health insurance information',
  'sexual orientations',
  'religions',
  'political views',
  'ethnicities',
]);

// Plain identifiers: unwelcome, but not directly actionable on their own
const MEDIUM_CLASSES = new Set([
  'email addresses',
  'usernames',
  'names',
  'ip addresses',
  'geographic locations',
  'social media profiles',
  'device information',
  'browser user agent details',
  'profile photos',
  'avatars',
]);

const TIER_RANK = { critical: 0, high: 1, medium: 2, low: 3 };

// Fold a hostname to the registrable domain, since HIBP indexes breaches that
// way: querying store.adobe.com returns nothing, adobe.com returns the breach
export const registrableDomain = (hostname) => {
  if (!hostname || typeof hostname !== 'string') return '';
  const host = hostname.trim().toLowerCase();
  if (!host) return '';
  try {
    return psl.parse(host)?.domain || host;
  } catch {
    return host;
  }
};

const ENTITIES = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#x27;': "'",
  '&#39;': "'",
  '&apos;': "'",
  '&nbsp;': ' ',
};

// HIBP descriptions contain real markup (<em>, <a href>). Rendering third-party
// HTML is precisely the flaw this tool reports on other people's sites, so the
// tags come out here rather than being trusted downstream.
export const stripHtml = (value) => {
  if (typeof value !== 'string' || !value) return '';
  return (
    value
      .replace(/<[^>]*>/g, ' ')
      .replace(/&[#a-z0-9]+;/gi, (entity) => ENTITIES[entity.toLowerCase()] ?? entity)
      .replace(/\s+/g, ' ')
      // A tag between a word and its punctuation leaves a gap: "exposed</a>."
      .replace(/\s+([.,;:!?])/g, '$1')
      .trim()
  );
};

export const classifyDataClass = (name) => {
  const key = typeof name === 'string' ? name.trim().toLowerCase() : '';
  if (CRITICAL_CLASSES.has(key)) return 'critical';
  if (HIGH_CLASSES.has(key)) return 'high';
  if (MEDIUM_CLASSES.has(key)) return 'medium';
  return 'low';
};

const toCount = (value) => (typeof value === 'number' && Number.isFinite(value) ? value : null);

const readDataClasses = (classes) => {
  if (!Array.isArray(classes)) return [];
  return classes
    .filter((name) => typeof name === 'string' && name.trim())
    .map((name) => ({ name, tier: classifyDataClass(name) }))
    .sort((a, b) => TIER_RANK[a.tier] - TIER_RANK[b.tier]);
};

const worstTier = (dataClasses) =>
  dataClasses.length
    ? dataClasses.reduce(
        (worst, c) => (TIER_RANK[c.tier] < TIER_RANK[worst] ? c.tier : worst),
        'low',
      )
    : 'low';

export const parseBreaches = (raw) => {
  if (!Array.isArray(raw)) return [];

  return raw.flatMap((entry) => {
    if (!entry || typeof entry !== 'object') return [];
    const name = entry.Name || entry.Title;
    if (!name) return [];

    const dataClasses = readDataClasses(entry.DataClasses);
    const verified = entry.IsVerified === true;
    const fabricated = entry.IsFabricated === true;
    const spamList = entry.IsSpamList === true;

    return [
      {
        name,
        title: entry.Title || entry.Name,
        domain: entry.Domain || null,
        breachDate: entry.BreachDate || null,
        addedDate: entry.AddedDate || null,
        modifiedDate: entry.ModifiedDate || null,
        accounts: toCount(entry.PwnCount),
        description: stripHtml(entry.Description),
        logo: entry.LogoPath || null,
        dataClasses,
        severity: worstTier(dataClasses),
        verified,
        fabricated,
        spamList,
        sensitive: entry.IsSensitive === true,
        retired: entry.IsRetired === true,
        malware: entry.IsMalware === true,
        stealerLog: entry.IsStealerLog === true,
        // Unverified, fabricated and spam-list entries are shown, but never
        // presented with the same weight as a confirmed incident
        trustworthy: verified && !fabricated && !spamList,
      },
    ];
  });
};

const byRisk = (a, b) => {
  if (a.trustworthy !== b.trustworthy) return a.trustworthy ? -1 : 1;
  const tier = TIER_RANK[a.severity] - TIER_RANK[b.severity];
  if (tier !== 0) return tier;
  return (b.breachDate || '').localeCompare(a.breachDate || '');
};

export const sortBreaches = (breaches) => [...breaches].sort(byRisk);

export const summariseBreaches = (breaches) => {
  const counts = breaches.map((b) => b.accounts).filter((n) => n !== null);
  const dates = breaches.map((b) => b.breachDate).filter(Boolean);
  const tiers = breaches.map((b) => TIER_RANK[b.severity]);
  const worst = tiers.length ? Math.min(...tiers) : null;

  return {
    total: breaches.length,
    totalAccounts: counts.reduce((sum, n) => sum + n, 0),
    worstSeverity:
      worst === null ? null : Object.keys(TIER_RANK).find((k) => TIER_RANK[k] === worst),
    latestBreachDate: dates.length ? dates.sort().at(-1) : null,
    verifiedCount: breaches.filter((b) => b.verified).length,
    unverifiedCount: breaches.filter((b) => !b.trustworthy).length,
  };
};

// The catalogue is queried per domain rather than downloaded whole: a miss is a
// two-byte response, which suits a serverless deploy far better than holding
// the full 1.2 MB catalogue in memory on every cold start
export const fetchBreachesForDomain = async (domain) => {
  const res = await httpGet(HIBP_BREACHES, { params: { domain }, timeout: HIBP_TIMEOUT });
  return res.data;
};

// Whether a redirect landed on a genuinely different site, and so is worth a
// second lookup: morele.pl 301s to morele.net, and the breach is catalogued
// against morele.net, so checking only what the user typed reports it clean
export const isDifferentSite = (scanned, destination) =>
  Boolean(scanned && destination && destination.includes('.') && destination !== scanned);

export const dedupeBreaches = (breaches) => {
  const seen = new Set();
  return breaches.filter((breach) => {
    if (seen.has(breach.name)) return false;
    seen.add(breach.name);
    return true;
  });
};

// Where the browser would actually end up. Best-effort: a site that refuses
// HEAD, hangs or fails simply yields nothing, and the caller carries on with
// the domain that was typed.
export const resolveFinalDomain = async (url) => {
  for (const method of ['HEAD', 'GET']) {
    try {
      const response = await fetch(url, {
        method,
        redirect: 'follow',
        signal: AbortSignal.timeout(REDIRECT_TIMEOUT),
        headers: { 'user-agent': UA },
      });
      if (!response.ok && method === 'HEAD') continue;
      return registrableDomain(new URL(response.url || url).hostname);
    } catch {
      // fall through to the next method, then give up
    }
  }
  return null;
};
