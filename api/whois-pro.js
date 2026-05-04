import axios from 'axios';
import middleware from './_common/middleware.js';
import { parseTarget } from './_common/parse-target.js';

// Server-side WhoAPI lookup so the API key never touches the client
const whoisProHandler = async (url) => {
  const key = process.env.WHO_API_KEY;
  if (!key) return { skipped: 'WhoAPI key not configured on this instance' };
  const { hostname } = parseTarget(url);
  try {
    const res = await axios.get(
      `https://api.whoapi.com/?domain=${hostname}&r=whois&apikey=${key}`,
      { timeout: 8000 },
    );
    return res.data;
  } catch (error) {
    return { error: `WhoIs lookup failed: ${error.message}` };
  }
};

export const handler = middleware(whoisProHandler);
export default handler;
