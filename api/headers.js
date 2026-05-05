import axios from 'axios';
import middleware from './_common/middleware.js';
import { upstreamError } from './_common/upstream.js';

const headersHandler = async (url) => {
  try {
    const response = await axios.get(url, {
      validateStatus: (status) => status >= 200 && status < 600,
    });
    return response.headers;
  } catch (error) {
    return upstreamError(error, 'Headers fetch');
  }
};

export const handler = middleware(headersHandler);
export default handler;
