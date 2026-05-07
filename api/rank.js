import middleware from './_common/middleware.js';
import { httpGet } from './_common/http.js';
import { parseTarget } from './_common/parse-target.js';
import { upstreamError } from './_common/upstream.js';

const rankHandler = async (url) => {
  const { hostname: domain } = parseTarget(url);
  const { TRANCO_USERNAME, TRANCO_API_KEY } = process.env;
  const auth = TRANCO_API_KEY
    ? { auth: { username: TRANCO_USERNAME, password: TRANCO_API_KEY } }
    : {};
  try {
    const response = await httpGet(`https://tranco-list.eu/api/ranks/domain/${domain}`, {
      timeout: 5000,
      ...auth,
    });
    if (!response.data?.ranks?.length) {
      return {
        skipped: `${domain} isn't ranked in the top 1 million sites yet`,
      };
    }
    return response.data;
  } catch (error) {
    return upstreamError(error, 'Tranco rank lookup');
  }
};

export const handler = middleware(rankHandler);
export default handler;
