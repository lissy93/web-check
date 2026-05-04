import axios from 'axios';
import middleware from './_common/middleware.js';
import { parseTarget } from './_common/parse-target.js';

// Resolve geographic info for a given IP via ipapi.co
const locationHandler = async (url) => {
  const { hostname } = parseTarget(url);
  try {
    const res = await axios.get(`https://ipapi.co/${hostname}/json/`, { timeout: 5000 });
    if (res.data?.error) return { skipped: res.data.reason || 'Lookup unavailable' };
    return res.data;
  } catch (error) {
    return { error: `IP lookup failed: ${error.message}` };
  }
};

export const handler = middleware(locationHandler);
export default handler;
