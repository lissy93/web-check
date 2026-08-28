import { bracketIPv6 } from './parse-target.js';
import { assertSafeUrl, installSsrfGuards } from './ssrf.js';
import { shouldSkip } from './check-skipper.js';

const normalizeUrl = (url) => {
  const withScheme = url.startsWith('http') ? url : `https://${url}`;
  return bracketIPv6(withScheme);
};

const TIMEOUT = parseInt(process.env.PUBLIC_API_TIMEOUT_LIMIT || '40000', 10);

// If present, set CORS allowed origins for responses
const ALLOWED_ORIGINS = process.env.API_CORS_ORIGIN || '*';

// Set the platform currently being used
let PLATFORM = 'NETLIFY';
if (process.env.PLATFORM) {
  PLATFORM = process.env.PLATFORM.toUpperCase();
} else if (process.env.VERCEL) {
  PLATFORM = 'VERCEL';
} else if (process.env.WC_SERVER) {
  PLATFORM = 'NODE';
}

// Define the headers to be returned with each response
const headers = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGINS,
  'Content-Type': 'application/json;charset=UTF-8',
};

const timeoutErrorMsg =
  'You can re-trigger this request, by clicking "Retry"\n' +
  "If you're running your own instance of Web Check, then you can " +
  'resolve this issue, by increasing the timeout limit in the ' +
  '`PUBLIC_API_TIMEOUT_LIMIT` environmental variable to a higher value (in milliseconds), ' +
  "or if you're hosting on Vercel increase the maxDuration in vercel.json.\n\n" +
  `The public instance currently has a lower timeout of ${TIMEOUT}ms ` +
  'in order to keep running costs affordable, so that Web Check can ' +
  'remain freely available for everyone.';

// A middleware function used by all API routes on all platforms
const commonMiddleware = (handler) => {
  installSsrfGuards();

  // Create a timeout promise, to throw an error if a request takes too long
  const createTimeoutPromise = (timeoutMs) => {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Request timed-out after ${timeoutMs} ms`));
      }, timeoutMs);
    });
  };

  // Vercel
  const vercelHandler = async (request, response) => {
    const queryParams = request.query || {};
    const rawUrl = queryParams.url;

    const { skip, reason } = shouldSkip(request.url, rawUrl);
    if (skip) {
      return response.status(200).json({ skipped: reason });
    }

    if (!rawUrl) {
      return response.status(500).json({ error: 'No URL specified' });
    }

    let url = normalizeUrl(rawUrl);
    try {
      url = await assertSafeUrl(url);
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }

    try {
      const result = await Promise.race([handler(url, request), createTimeoutPromise(TIMEOUT)]);
      response.status(200).json(typeof result === 'object' ? result : JSON.parse(result));
    } catch (error) {
      const isTimeout = error.message.includes('timed-out') || response.statusCode === 504;
      const message = isTimeout ? `${error.message}\n\n${timeoutErrorMsg}` : error.message;
      response.status(isTimeout ? 408 : 500).json({ error: message });
    }
  };

  // Netlify
  const netlifyHandler = async (event, context) => {
    const queryParams = event.queryStringParameters || event.query || {};
    const rawUrl = queryParams.url;

    const { skip, reason } = shouldSkip(event.path || event.rawUrl, rawUrl);
    if (skip) {
      return { statusCode: 200, body: JSON.stringify({ skipped: reason }), headers };
    }

    if (!rawUrl) {
      return { statusCode: 500, body: JSON.stringify({ error: 'No URL specified' }), headers };
    }

    let url = normalizeUrl(rawUrl);
    try {
      url = await assertSafeUrl(url);
    } catch (error) {
      return { statusCode: 400, body: JSON.stringify({ error: error.message }), headers };
    }

    try {
      const result = await Promise.race([
        handler(url, event, context),
        createTimeoutPromise(TIMEOUT),
      ]);
      return {
        statusCode: 200,
        body: typeof result === 'object' ? JSON.stringify(result) : result,
        headers,
      };
    } catch (error) {
      return { statusCode: 500, body: JSON.stringify({ error: error.message }), headers };
    }
  };

  // The format of the handlers varies between platforms
  const nativeMode = ['VERCEL', 'NODE'].includes(PLATFORM);
  return nativeMode ? vercelHandler : netlifyHandler;
};

if (PLATFORM === 'NETLIFY') {
  module.exports = commonMiddleware;
}

export default commonMiddleware;
