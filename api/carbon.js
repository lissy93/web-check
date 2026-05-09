import middleware from './_common/middleware.js';
import { createLogger } from './_common/logger.js';

const log = createLogger('carbon');

const TIMEOUT = 8000;
const MAX_BYTES = 10 * 1024 * 1024;
const USER_AGENT = 'Mozilla/5.0 (compatible; WebCheck/2.0; +https://web-check.xyz)';

// Sustainable Web Design model v3 constants, matches websitecarbon.com formula
const KWH_PER_GB = 0.81;
const FIRST_VISIT = 0.25;
const RETURN_VISIT = 0.75;
const RETURN_DATA_PCT = 0.02;
const GRID_INTENSITY = 442;
const RENEWABLE_INTENSITY = 50;
const LITRES_PER_GRAM = 0.5562;

// Reference median grams CO2 per visit, drawn from websitecarbon's published average.
// Used to estimate a percentile rank since we lack their measured-sites dataset
const REFERENCE_MEDIAN_GRAMS = 0.8;

// Approximate percentile via log2 distance from the reference median.
// 1 doubling above median drops 25 points; clamp to [1, 99]
const estimateCleanerThan = (grams) => {
  if (!grams || grams <= 0) return 0;
  const pct = 50 - 25 * Math.log2(grams / REFERENCE_MEDIAN_GRAMS);
  return Math.max(1, Math.min(99, Math.round(pct)));
};

// Stream the response, cap at MAX_BYTES so huge pages can't blow memory or time
const fetchByteCount = async (url) => {
  const r = await fetch(url, {
    signal: AbortSignal.timeout(TIMEOUT),
    redirect: 'follow',
    headers: { 'user-agent': USER_AGENT, accept: 'text/html,*/*;q=0.1' },
  });
  if (!r.ok) throw new Error(`status ${r.status}`);
  if (!r.body) return 0;
  const reader = r.body.getReader();
  let total = 0;
  while (total < MAX_BYTES) {
    const { value, done } = await reader.read();
    if (done) break;
    total += value.length;
  }
  reader.cancel().catch(() => {});
  return total;
};

// SWD-based stats matching websitecarbon /data response shape
const computeCarbon = (bytes) => {
  const adjustedBytes = bytes * (FIRST_VISIT + RETURN_VISIT * RETURN_DATA_PCT);
  const energy = (adjustedBytes / 1073741824) * KWH_PER_GB;
  const gridGrams = energy * GRID_INTENSITY;
  const renewableGrams = energy * RENEWABLE_INTENSITY;
  return {
    adjustedBytes,
    energy,
    co2: {
      grid: { grams: gridGrams, litres: gridGrams * LITRES_PER_GRAM },
      renewable: {
        grams: renewableGrams,
        litres: renewableGrams * LITRES_PER_GRAM,
      },
    },
  };
};

// Fetch site, count bytes, compute SWD carbon stats locally, no third-party API
const carbonHandler = async (url) => {
  let bytes;
  try {
    bytes = await fetchByteCount(url);
  } catch (error) {
    log.warn(`fetch failed for ${url}`, error.message);
    return { error: `Failed to fetch site: ${error.message}` };
  }
  if (!bytes) return { skipped: 'Site returned no content, cannot calculate carbon' };
  log.debug(`measured ${bytes} bytes for ${url}`);
  const statistics = computeCarbon(bytes);
  return {
    url,
    bytes,
    green: false,
    statistics,
    cleanerThan: estimateCleanerThan(statistics.co2.grid.grams),
    scanUrl: url,
  };
};

export const handler = middleware(carbonHandler);
export default handler;
