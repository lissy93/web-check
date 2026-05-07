import middleware from './_common/middleware.js';
import { httpGet } from './_common/http.js';
import { requireEnv, upstreamError } from './_common/upstream.js';

const qualityHandler = async (url) => {
  const auth = requireEnv('GOOGLE_CLOUD_API_KEY', 'Quality check');
  if (auth.skipped) return auth;
  const endpoint =
    `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?` +
    `url=${encodeURIComponent(url)}&category=PERFORMANCE&category=ACCESSIBILITY` +
    `&category=BEST_PRACTICES&category=SEO&category=PWA&strategy=mobile` +
    `&key=${auth.value}`;

  let data;
  try {
    data = (await httpGet(endpoint)).data;
  } catch (error) {
    return upstreamError(error, 'Quality check');
  }
  const result = data.lighthouseResult || data;
  if (!result?.categories || !Object.keys(result.categories).length) {
    return { skipped: 'No quality report available for this URL' };
  }
  return result;
};

export const handler = middleware(qualityHandler);
export default handler;
