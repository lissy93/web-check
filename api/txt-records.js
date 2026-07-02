import dns from 'dns/promises';
import middleware from './_common/middleware.js';
import { parseTarget } from './_common/parse-target.js';

const NO_RECORDS = new Set(['ENODATA', 'ENOTFOUND', 'NXDOMAIN']);

const txtRecordHandler = async (url) => {
  const { hostname } = parseTarget(url);
  let txtRecords;
  try {
    txtRecords = await dns.resolveTxt(hostname);
  } catch (error) {
    if (NO_RECORDS.has(error.code)) return { skipped: 'No TXT records for this host' };
    throw error;
  }
  // Join chunks (DNS splits long records at 255 bytes), then key=value
  const result = {};
  for (const chunks of txtRecords) {
    const full = chunks.join('');
    const eq = full.indexOf('=');
    let key = eq > 0 ? full.slice(0, eq) : full;
    const val = eq > 0 ? full.slice(eq + 1) : '';
    while (key in result) key += '_';
    result[key] = val;
  }
  return result;
};

export const handler = middleware(txtRecordHandler);
export default handler;
