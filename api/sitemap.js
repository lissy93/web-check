import axios from 'axios';
import xml2js from 'xml2js';
import middleware from './_common/middleware.js';

const HARD_TIMEOUT = 5000;
const MAX_DEPTH = 3;
const MAX_CHILD_SITEMAPS = 25;

// Fetch and parse a sitemap XML
const fetchSitemap = async (sitemapUrl) => {
  const res = await axios.get(sitemapUrl, { timeout: HARD_TIMEOUT });
  return new xml2js.Parser().parseStringPromise(res.data);
};

// Pull a Sitemap: line out of robots.txt
const findSitemapInRobots = async (baseUrl) => {
  const robots = await axios.get(`${baseUrl}/robots.txt`, { timeout: HARD_TIMEOUT });
  for (const line of robots.data.split('\n')) {
    if (line.toLowerCase().startsWith('sitemap:')) {
      return line.split(/\s+/)[1]?.trim() || null;
    }
  }
  return null;
};

// Recursively flatten a sitemap-index into its child url sets
const expandSitemap = async (parsed, depth) => {
  if (!parsed?.sitemapindex?.sitemap || depth >= MAX_DEPTH) return parsed;
  const children = parsed.sitemapindex.sitemap
    .map(s => s?.loc?.[0])
    .filter(Boolean)
    .slice(0, MAX_CHILD_SITEMAPS);
  const fetched = await Promise.all(
    children.map(loc => fetchSitemap(loc).catch(err => ({ error: err.message, loc })))
  );
  const expanded = await Promise.all(
    fetched.map(child => child?.error ? child : expandSitemap(child, depth + 1))
  );
  const urls = expanded.flatMap(child => child?.urlset?.url || []);
  return {
    sitemapindex: parsed.sitemapindex,
    urlset: urls.length ? { url: urls } : undefined,
    sources: children,
  };
};

const sitemapHandler = async (url) => {
  let sitemapUrl = `${url}/sitemap.xml`;
  try {
    let parsed;
    try {
      parsed = await fetchSitemap(sitemapUrl);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        const robotsSitemap = await findSitemapInRobots(url);
        if (!robotsSitemap) return { skipped: 'No sitemap found' };
        sitemapUrl = robotsSitemap;
        parsed = await fetchSitemap(sitemapUrl);
      } else {
        throw error;
      }
    }
    return await expandSitemap(parsed, 0);
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      return { error: `Request timed-out after ${HARD_TIMEOUT}ms` };
    }
    return { error: error.message };
  }
};

export const handler = middleware(sitemapHandler);
export default handler;
