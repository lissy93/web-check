const normalizeUrl = (url) => {
  return url.startsWith('http') ? url : `https://${url}`;
};

// If present, set a shorter timeout for API requests
const TIMEOUT = process.env.API_TIMEOUT_LIMIT ? parseInt(process.env.API_TIMEOUT_LIMIT, 10) : 60000;

// If present, set CORS allowed origins for responses
const ALLOWED_ORIGINS = process.env.API_CORS_ORIGIN || '*';

// Set the platform currently being used
let PLATFORM = 'NETLIFY';
if (process.env.PLATFORM) { PLATFORM = process.env.PLATFORM.toUpperCase(); }
else if (process.env.VERCEL) { PLATFORM = 'VERCEL'; }
else if (process.env.WC_SERVER) { PLATFORM = 'NODE'; }

// Define the headers to be returned with each response
const headers = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGINS,
  'Access-Control-Allow-Credentials': true,
  'Content-Type': 'application/json;charset=UTF-8',
};


const timeoutErrorMsg = 'You can re-trigger this request, by clicking "Retry"\n'
+ 'If you\'re running your own instance of Web Check, then you can '
+ 'resolve this issue, by increasing the timeout limit in the '
+ '`API_TIMEOUT_LIMIT` environmental variable to a higher value (in milliseconds), '
+ 'or if you\'re hosting on Vercel increase the maxDuration in vercel.json.\n\n'
+ `The public instance currently has a lower timeout of ${TIMEOUT}ms `
+ 'in order to keep running costs affordable, so that Web Check can '
+ 'remain freely available for everyone.';

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
    const queryParams = request.query || {};
    const rawUrl = queryParams.url;

    if (!rawUrl) {
      return response.status(500).json({ error: 'No URL specified' });
    }

    const url = normalizeUrl(rawUrl);

    try {
      // Race the handler against the timeout
      const handlerResponse = await Promise.race([
        handler(url, request),
        createTimeoutPromise(TIMEOUT)
      ]);

      if (handlerResponse.body && handlerResponse.statusCode) {
        response.status(handlerResponse.statusCode).json(handlerResponse.body);
      } else {
        response.status(200).json(
          typeof handlerResponse === 'object' ? handlerResponse : JSON.parse(handlerResponse)
        );
      }
    } catch (error) {
      let errorCode = 500;
      if (error.message.includes('timed-out') || response.statusCode === 504) {
        errorCode = 408;
        error.message = `${error.message}\n\n${timeoutErrorMsg}`;
      }
      response.status(errorCode).json({ error: error.message });
    }
  };

  // Netlify
  const netlifyHandler = async (event, context, callback) => {
    const queryParams = event.queryStringParameters || event.query || {};
    const rawUrl = queryParams.url;

    if (!rawUrl) {
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({ error: 'No URL specified' }),
        headers,
      });
      return;
    }

    const url = normalizeUrl(rawUrl);

    try {
      // Race the handler against the timeout
      const handlerResponse = await Promise.race([
        handler(url, event, context),
        createTimeoutPromise(TIMEOUT)
      ]);

      if (handlerResponse.body && handlerResponse.statusCode) {
        callback(null, handlerResponse);
      } else {
        callback(null, {
          statusCode: 200,
          body: typeof handlerResponse === 'object' ? JSON.stringify(handlerResponse) : handlerResponse,
          headers,
        });
      }
    } catch (error) {
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
        headers,
      });
    }
  };

  // The format of the handlers varies between platforms
  const nativeMode = (['VERCEL', 'NODE'].includes(PLATFORM));
  return nativeMode ? vercelHandler : netlifyHandler;
};

if (PLATFORM === 'NETLIFY') {
  module.exports = commonMiddleware;
}

export default commonMiddleware;
