import axios from 'axios';
import middleware from './_common/middleware.js';
import { parseTarget } from './_common/parse-target.js';

// Server-side Shodan lookup so the API key never touches the client
const shodanHandler = async (url) => {
  const key = process.env.SHODAN_API_KEY;
  if (!key) return { skipped: 'Shodan API key not configured on this instance' };
  const { hostname } = parseTarget(url);
  try {
    const res = await axios.get(
      `https://api.shodan.io/shodan/host/${hostname}?key=${key}`,
      { timeout: 8000 },
    );
    return res.data;
  } catch (error) {
    if (error.response?.status === 404) return { skipped: 'No Shodan data for this host' };
    return { error: `Shodan lookup failed: ${error.message}` };
  }
};

export const handler = middleware(shodanHandler);
export default handler;
