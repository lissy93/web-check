import middleware from './_common/middleware.js';
import { httpGet } from './_common/http.js';
import { parseTarget } from './_common/parse-target.js';
import { upstreamError } from './_common/upstream.js';

const rankHandler = async (url) => {
  const { hostname } = parseTarget(url);
  const { TRANCO_USERNAME, TRANCO_API_KEY } = process.env;
  const auth = TRANCO_API_KEY
    ? { auth: { username: TRANCO_USERNAME, password: TRANCO_API_KEY } }
    : {};
  const fallback = hostname.startsWith('www.') ? hostname.slice(4) : `www.${hostname}`;
  // Tranco indexes only one variant per site, so try as-is, then toggle www
  const lookup = (domain) => httpGet(`https://tranco-list.eu/api/ranks/domain/${domain}`, auth);
  try {
    const first = await lookup(hostname);
    if (first.data?.ranks?.length) return first.data;
    try {
      const second = await lookup(fallback);
      if (second.data?.ranks?.length) return second.data;
    } catch {
      // Ignore fallback failures (e.g. rate limit) and accept the empty first result
    }
    return { skipped: `${hostname} isn't ranked in the top 1 million sites yet` };
  } catch (error) {
    return upstreamError(error, 'Tranco rank lookup');
  }
};

export const handler = middleware(rankHandler);
export default handler;
