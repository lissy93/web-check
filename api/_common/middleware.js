import { bracketIPv6 } from './parse-target.js';

const normalizeUrl = (url) => {
  const withScheme = url.startsWith('http') ? url : `https://${url}`;
  return bracketIPv6(withScheme);
};

const TIMEOUT = parseInt(process.env.PUBLIC_API_TIMEOUT_LIMIT || '40000', 10);

// If present, set CORS allowed origins for responses
const ALLOWED_ORIGINS = process.env.API_CORS_ORIGIN || '*';

// Disable everything :( Setting this env var will turn off the instance, and show message
const DISABLE_EVERYTHING = !!process.env.VITE_DISABLE_EVERYTHING;

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
  'Access-Control-Allow-Credentials': true,
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

const disabledMsg =
  'WebCheck is temporarily disabled.\n\n' +
  'Due to the increased cost of running Web Check, the public instance has been ' +
  'paused while we look for affordable ways to keep it free for everyone.\n' +
  'Since the code is free and open source, you can run your own instance by ' +
  'following the instructions in the GitHub repo.';

// A middleware function used by all API routes on all platforms
const commonMiddleware = (handler) => {
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
    if (DISABLE_EVERYTHING) {
      return response.status(200).json({ skipped: disabledMsg });
    }

    const queryParams = request.query || {};
    const rawUrl = queryParams.url;

    if (!rawUrl) {
      return response.status(500).json({ error: 'No URL specified' });
    }

    const url = normalizeUrl(rawUrl);

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

    if (DISABLE_EVERYTHING) {
      return { statusCode: 200, body: JSON.stringify({ skipped: disabledMsg }), headers };
    }
    if (!rawUrl) {
      return { statusCode: 500, body: JSON.stringify({ error: 'No URL specified' }), headers };
    }

    const url = normalizeUrl(rawUrl);
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
