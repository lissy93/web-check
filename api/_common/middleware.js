const normalizeUrl = (url) => {
  // Normalizing logic here
  return url.startsWith('http') ? url : `http://${url}`;
};

const commonMiddleware = (handler) => {
  return async (event, context, callback) => {
    try {
      const rawUrl = event.queryStringParameters.url;
      const url = normalizeUrl(rawUrl);

      // Call the specific handler with the normalized URL
      const response = await handler(url, event, context);

      callback(null, {
        statusCode: 200,
        body: JSON.stringify(response),
      });
    } catch (error) {
      console.log(error);
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      });
    }
  };
};

module.exports = commonMiddleware;
