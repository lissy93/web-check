import xml2js from 'xml2js';
import middleware from './_common/middleware.js';
import { httpGet } from './_common/http.js';
import { upstreamError } from './_common/upstream.js';
import { createLogger } from './_common/logger.js';

const log = createLogger('sitemap');
const TIMEOUT = 6000;
const MAX_DEPTH = 3;
const MAX_CHILD_SITEMAPS = 25;
const MAX_URLS = 5000;

// Browser-ish headers so picky CDNs do not return 406/403 to the default Node UA
const HEADERS = {
  'user-agent': 'Mozilla/5.0 (compatible; web-check-bot/1.0; +https://web-check.xyz)',
  accept: 'application/xml, text/xml, application/rss+xml, */*;q=0.1',
};

// Reduce a target URL to its origin so child paths resolve cleanly
const toOrigin = (url) => {
  try {
    return new URL(url).origin;
  } catch {
    return url.replace(/\/+$/, '');
  }
};

// Fetch and parse XML in lenient mode so minor well-formedness errors do not abort
const fetchSitemap = async (sitemapUrl) => {
  const res = await httpGet(sitemapUrl, { timeout: TIMEOUT, headers: HEADERS });
  return new xml2js.Parser({ strict: false, normalizeTags: true }).parseStringPromise(res.data);
};

// Pull the first Sitemap: directive out of robots.txt, if any
const findSitemapInRobots = async (origin) => {
  try {
    const robots = await httpGet(`${origin}/robots.txt`, { timeout: TIMEOUT, headers: HEADERS });
    for (const line of String(robots.data).split('\n')) {
      if (line.toLowerCase().startsWith('sitemap:')) {
        return line.split(/\s+/)[1]?.trim() || null;
      }
    }
  } catch (error) {
    log.debug(`robots.txt fetch failed for ${origin}`, error.message);
  }
  return null;
};

// Recursively flatten a sitemap-index into its child url sets
const expandSitemap = async (parsed, depth) => {
  if (!parsed?.sitemapindex?.sitemap || depth >= MAX_DEPTH) return parsed;
  const children = parsed.sitemapindex.sitemap
    .map((s) => s?.loc?.[0])
    .filter(Boolean)
    .slice(0, MAX_CHILD_SITEMAPS);
  const fetched = await Promise.all(
    children.map((loc) =>
      fetchSitemap(loc).catch((error) => {
        log.debug(`child sitemap failed for ${loc}`, error.message);
        return null;
      }),
    ),
  );
  const expanded = await Promise.all(
    fetched.map((child) => (child ? expandSitemap(child, depth + 1) : null)),
  );
  const urls = expanded.flatMap((child) => child?.urlset?.url || []);
  return {
    sitemapindex: parsed.sitemapindex,
    urlset: urls.length ? { url: urls } : undefined,
    sources: children,
  };
};

// Whether the parsed XML matched one of the canonical sitemap shapes
const isValidSitemap = (p) => !!(p?.urlset?.url?.length || p?.sitemapindex?.sitemap?.length);

// Keep only the four fields the frontend renders, dropping locale alternates and image/video extras
const slimUrl = (u) => {
  const out = { loc: u.loc };
  if (u.lastmod) out.lastmod = u.lastmod;
  if (u.changefreq) out.changefreq = u.changefreq;
  if (u.priority) out.priority = u.priority;
  return out;
};

// Drop bulky XML extensions and cap total entries so the JSON payload stays sane
const slimResult = (r) => {
  if (!r) return r;
  const out = {};
  if (r.urlset?.url) out.urlset = { url: r.urlset.url.slice(0, MAX_URLS).map(slimUrl) };
  if (r.sitemapindex?.sitemap) {
    out.sitemapindex = {
      sitemap: r.sitemapindex.sitemap.map((s) => ({ loc: s.loc })),
    };
  }
  if (r.sources) out.sources = r.sources;
  return out;
};

// Try a candidate URL, return parsed result only when it looks like a real sitemap
const tryFetch = async (target, label) => {
  try {
    const parsed = await fetchSitemap(target);
    if (isValidSitemap(parsed)) return parsed;
    log.debug(`${label} parsed but lacked urlset/sitemapindex (${target})`);
  } catch (error) {
    log.debug(`${label} fetch failed (${target})`, error.message);
  }
  return null;
};

const sitemapHandler = async (url) => {
  const origin = toOrigin(url);
  let parsed = await tryFetch(`${origin}/sitemap.xml`, 'sitemap.xml');
  if (!parsed) {
    const fromRobots = await findSitemapInRobots(origin);
    if (fromRobots) parsed = await tryFetch(fromRobots, 'robots-listed sitemap');
  }
  if (!parsed) return { skipped: 'No sitemap found for this site' };
  try {
    return slimResult(await expandSitemap(parsed, 0));
  } catch (error) {
    return upstreamError(error, 'Sitemap fetch');
  }
};

export const handler = middleware(sitemapHandler);
export default handler;
