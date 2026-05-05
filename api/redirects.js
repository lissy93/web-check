import middleware from './_common/middleware.js';
import { upstreamError } from './_common/upstream.js';

const MAX_REDIRECTS = 12;
const TIMEOUT_MS = 10000;
const USER_AGENT = 'Mozilla/5.0 (compatible; WebCheck/2.0; +https://web-check.xyz)';

// Walks the redirect chain manually, recording each Location header as got did
const redirectsHandler = async (url) => {
  const redirects = [url];
  let current = url;
  try {
    for (let i = 0; i < MAX_REDIRECTS; i++) {
      const response = await fetch(current, {
        redirect: 'manual',
        signal: AbortSignal.timeout(TIMEOUT_MS),
        headers: { 'user-agent': USER_AGENT },
      });
      if (response.status < 300 || response.status >= 400) {
        if (response.status >= 400) {
          const err = new Error(`HTTP ${response.status}`);
          err.response = { status: response.status };
          throw err;
        }
        break;
      }
      const location = response.headers.get('location');
      if (!location) break;
      redirects.push(location);
      current = new URL(location, current).href;
    }
    return { redirects };
  } catch (error) {
    if (error.cause?.code) error.code = error.cause.code;
    if (error.name === 'TimeoutError' || error.name === 'AbortError') {
      error.code = 'ECONNABORTED';
    }
    return upstreamError(error, 'Redirect lookup');
  }
};

export const handler = middleware(redirectsHandler);
export default handler;
