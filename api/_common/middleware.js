const normalizeUrl = (url) => {
  return url.startsWith('http') ? url : `https://${url}`;
};

const commonMiddleware = (handler) => {
  return async (event, context, callback) => {
    
    const rawUrl = (event.queryStringParameters || event.query).url;
    
    if (!rawUrl) {
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({ error: 'No URL specified' }),
      });
    }

    const url = normalizeUrl(rawUrl);

    try {
      const response = await handler(url, event, context);
      if (response.body && response.statusCode) {
      callback(null, response);
      } else {
        callback(null, {
          statusCode: 200,
          body: typeof response === 'object' ? JSON.stringify(response) : response,
        });
      }
    } catch (error) {
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      });
    }
  };
};

module.exports = commonMiddleware;
