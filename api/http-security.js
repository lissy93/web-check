import middleware from './_common/middleware.js';
import { httpGet } from './_common/http.js';

// Security headers to check, mapped to response field names
const HEADERS = {
  'content-security-policy': 'contentSecurityPolicy',
  'strict-transport-security': 'strictTransportPolicy',
  'x-content-type-options': 'xContentTypeOptions',
  'x-frame-options': 'xFrameOptions',
  'x-xss-protection': 'xXSSProtection',
  'referrer-policy': 'referrerPolicy',
  'permissions-policy': 'permissionsPolicy',
  'cross-origin-opener-policy': 'crossOriginOpenerPolicy',
  'cross-origin-resource-policy': 'crossOriginResourcePolicy',
  'cross-origin-embedder-policy': 'crossOriginEmbedderPolicy',
};

const httpsSecHandler = async (url) => {
  try {
    const { headers } = await httpGet(url, {
      validateStatus: () => true,
    });
    return Object.fromEntries(Object.entries(HEADERS).map(([h, key]) => [key, !!headers[h]]));
  } catch (error) {
    return { error: `Unable to fetch headers: ${error.message}` };
  }
};

export const handler = middleware(httpsSecHandler);
export default handler;
