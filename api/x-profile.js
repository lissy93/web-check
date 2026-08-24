import middleware from './_common/middleware.js';
import { httpGet } from './_common/http.js';
import { lookupXProfile } from './_common/x-profile.js';
import { upstreamError } from './_common/upstream.js';

const xProfileHandler = async (url) => {
  try {
    return await lookupXProfile({
      targetUrl: url,
      apiKey: process.env.XQUIK_API_KEY,
      get: httpGet,
    });
  } catch (error) {
    return upstreamError(error, 'Xquik profile');
  }
};

export const handler = middleware(xProfileHandler);
export default handler;
