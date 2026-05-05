import middleware from './_common/middleware.js';
import { httpGet } from './_common/http.js';
import { upstreamError } from './_common/upstream.js';

const headersHandler = async (url) => {
  try {
    const response = await httpGet(url, {
      validateStatus: (status) => status >= 200 && status < 600,
    });
    return response.headers;
  } catch (error) {
    return upstreamError(error, 'Headers fetch');
  }
};

export const handler = middleware(headersHandler);
export default handler;
