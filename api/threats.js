import xml2js from 'xml2js';
import middleware from './_common/middleware.js';
import { httpPost } from './_common/http.js';
import { parseTarget } from './_common/parse-target.js';
import { requireEnv, upstreamError } from './_common/upstream.js';

const safeBrowsing = async (url) => {
  const auth = requireEnv('GOOGLE_CLOUD_API_KEY', 'Google Safe Browsing');
  if (auth.skipped) return auth;
  try {
    const res = await httpPost(
      `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${auth.value}`,
      {
        threatInfo: {
          threatTypes: [
            'MALWARE',
            'SOCIAL_ENGINEERING',
            'UNWANTED_SOFTWARE',
            'POTENTIALLY_HARMFUL_APPLICATION',
            'API_ABUSE',
          ],
          platformTypes: ['ANY_PLATFORM'],
          threatEntryTypes: ['URL'],
          threatEntries: [{ url }],
        },
      },
    );
    return res.data?.matches ? { unsafe: true, details: res.data.matches } : { unsafe: false };
  } catch (error) {
    return upstreamError(error, 'Google Safe Browsing');
  }
};

const urlHaus = async (url) => {
  const { hostname } = parseTarget(url);
  try {
    const res = await httpPost('https://urlhaus-api.abuse.ch/v1/host/', `host=${hostname}`, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return res.data;
  } catch (error) {
    return upstreamError(error, 'URLhaus');
  }
};

const phishTank = async (url) => {
  try {
    const encoded = Buffer.from(url).toString('base64');
    const res = await httpPost(`https://checkurl.phishtank.com/checkurl/?url=${encoded}`, null, {
      headers: { 'User-Agent': 'phishtank/web-check' },
      timeout: 3000,
    });
    const parsed = await xml2js.parseStringPromise(res.data, { explicitArray: false });
    return parsed.response.results;
  } catch (error) {
    return upstreamError(error, 'PhishTank');
  }
};

const cloudmersive = async (url) => {
  const auth = requireEnv('CLOUDMERSIVE_API_KEY', 'Cloudmersive');
  if (auth.skipped) return auth;
  try {
    const res = await httpPost(
      'https://api.cloudmersive.com/virus/scan/website',
      `Url=${encodeURIComponent(url)}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Apikey: auth.value,
        },
      },
    );
    return res.data;
  } catch (error) {
    return upstreamError(error, 'Cloudmersive');
  }
};

// Aggregate four threat-feed lookups; skip the card if every source failed
const threatsHandler = async (url) => {
  const sources = await Promise.all([
    safeBrowsing(url),
    urlHaus(url),
    phishTank(url),
    cloudmersive(url),
  ]);
  const [safe, haus, phish, cloud] = sources;
  if (sources.every((s) => s?.error || s?.skipped)) {
    return { skipped: 'No threat sources returned data for this host' };
  }
  return { safeBrowsing: safe, urlHaus: haus, phishTank: phish, cloudmersive: cloud };
};

export const handler = middleware(threatsHandler);
export default handler;
