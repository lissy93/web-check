import got from 'got';
import middleware from './_common/middleware.js';
import { upstreamError } from './_common/upstream.js';

const redirectsHandler = async (url) => {
  const redirects = [url];
  try {
    await got(url, {
      followRedirect: true,
      maxRedirects: 12,
      hooks: {
        beforeRedirect: [
          (_options, response) => { redirects.push(response.headers.location); },
        ],
      },
    });
    return { redirects };
  } catch (error) {
    return upstreamError(error, 'Redirect lookup');
  }
};

export const handler = middleware(redirectsHandler);
export default handler;
