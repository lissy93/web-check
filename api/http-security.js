import middleware from './_common/middleware.js';
import { httpGet } from './_common/http.js';
import { upstreamError } from './_common/upstream.js';

const httpsSecHandler = async (url) => {
  try {
    const { headers } = await httpGet(url);
    return {
      strictTransportPolicy: !!headers['strict-transport-security'],
      xFrameOptions: !!headers['x-frame-options'],
      xContentTypeOptions: !!headers['x-content-type-options'],
      xXSSProtection: !!headers['x-xss-protection'],
      contentSecurityPolicy: !!headers['content-security-policy'],
    };
  } catch (error) {
    return upstreamError(error, 'HTTP security check');
  }
};

export const handler = middleware(httpsSecHandler);
export default handler;
