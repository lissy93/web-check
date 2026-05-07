import middleware from './_common/middleware.js';
import { httpGet } from './_common/http.js';
import { parseTarget } from './_common/parse-target.js';
import { requireEnv, upstreamError } from './_common/upstream.js';

// Server-side Shodan lookup so the API key never touches the client
const shodanHandler = async (url) => {
  const auth = requireEnv('SHODAN_API_KEY', 'Shodan');
  if (auth.skipped) return auth;
  const { hostname } = parseTarget(url);
  try {
    const res = await httpGet(`https://api.shodan.io/shodan/host/${hostname}?key=${auth.value}`, {
      timeout: 8000,
    });
    return res.data;
  } catch (error) {
    return upstreamError(error, 'Shodan lookup');
  }
};

export const handler = middleware(shodanHandler);
export default handler;
