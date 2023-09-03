const normalizeUrl = (url) => {
  return url.startsWith('http') ? url : `https://${url}`;
};

const headers = {
  'Access-Control-Allow-Origin': process.env.API_CORS_ORIGIN || '*',
  'Access-Control-Allow-Credentials': true,
  'Content-Type': 'application/json;charset=UTF-8',
};

const commonMiddleware = (handler) => {
  // Vercel
  const vercelHandler = async (request, response) => {
    const queryParams = request.query || {};
    const rawUrl = queryParams.url;

    if (!rawUrl) {
      return response.status(500).json({ error: 'No URL specified' });
    }

    const url = normalizeUrl(rawUrl);

    try {
      const handlerResponse = await handler(url, request);
      if (handlerResponse.body && handlerResponse.statusCode) {
        response.status(handlerResponse.statusCode).json(handlerResponse.body);
      } else {
        response.status(200).json(
          typeof handlerResponse === 'object' ? handlerResponse : JSON.parse(handlerResponse)
        );
      }
    } catch (error) {
      response.status(500).json({ error: error.message });
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
      const handlerResponse = await handler(url, event, context);
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
  // E.g. Netlify + AWS expect Lambda functions, but Vercel or Node needs standard handler
  const platformEnv = (process.env.PLATFORM || '').toUpperCase(); // Has user set platform manually?

  const nativeMode = (['VERCEL', 'NODE'].includes(platformEnv) || process.env.VERCEL || process.env.WC_SERVER);

  return nativeMode ? vercelHandler : netlifyHandler;
};

module.exports = commonMiddleware;
