import https from 'https';
import middleware from './_common/middleware.js';

const FETCH_TIMEOUT = 8000;

// Read a URL via https.get and return the full body string
const fetchBody = (url) => new Promise((resolve, reject) => {
  const req = https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => resolve(data));
    res.on('error', reject);
  });
  req.setTimeout(FETCH_TIMEOUT, () => {
    req.destroy();
    reject(new Error('Request timed out'));
  });
  req.on('error', reject);
});

const carbonHandler = async (url) => {
  let html;
  try {
    html = await fetchBody(url);
  } catch (error) {
    return { error: `Failed to fetch site: ${error.message}` };
  }
  const sizeInBytes = Buffer.byteLength(html, 'utf8');
  const carbonUrl = `https://api.websitecarbon.com/data?bytes=${sizeInBytes}&green=0`;
  let raw;
  try {
    raw = await fetchBody(carbonUrl);
  } catch (error) {
    return { error: `WebsiteCarbon API request failed: ${error.message}` };
  }
  const trimmed = raw.trim();
  if (trimmed.startsWith('<')) {
    return { error: 'WebsiteCarbon API returned HTML instead of JSON. '
      + 'This may be due to Cloudflare protection on datacenter IPs.' };
  }
  let data;
  try {
    data = JSON.parse(trimmed);
  } catch (error) {
    return { error: `Failed to parse WebsiteCarbon API response: ${error.message}` };
  }
  if (!data.statistics
      || (data.statistics.adjustedBytes === 0 && data.statistics.energy === 0)) {
    return { skipped: 'Not enough info to get carbon data' };
  }
  data.scanUrl = url;
  return data;
};

export const handler = middleware(carbonHandler);
export default handler;
