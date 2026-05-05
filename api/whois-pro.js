import middleware from './_common/middleware.js';
import { httpGet } from './_common/http.js';
import { parseTarget } from './_common/parse-target.js';
import { requireEnv, upstreamError } from './_common/upstream.js';

const whoisProHandler = async (url) => {
  const auth = requireEnv('WHO_API_KEY', 'WhoAPI');
  if (auth.skipped) return auth;
  const { hostname } = parseTarget(url);
  let data;
  try {
    const res = await httpGet(
      `https://api.whoapi.com/?domain=${hostname}&r=whois&apikey=${auth.value}`,
      { timeout: 8000 },
    );
    data = res.data;
  } catch (error) {
    return upstreamError(error, 'WhoIs lookup');
  }
  if (data?.status !== '0') {
    return { error: data?.status_desc || 'WhoAPI returned a non-success status' };
  }
  const result = {
    created: data.date_created,
    updated: data.date_updated,
    expires: data.date_expires,
    nameservers: data.nameservers,
  };
  if (!result.created && !result.updated && !result.expires
      && !result.nameservers?.length) {
    return { skipped: 'No WHOIS data available for this domain' };
  }
  return result;
};

export const handler = middleware(whoisProHandler);
export default handler;
