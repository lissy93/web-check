const dns = require('dns');

/* Lambda function to fetch the IP address of a given URL */
exports.handler = function (event, context, callback) {
  const addressParam = event.queryStringParameters.url;
  
  if (!addressParam) {
    callback(null, errorResponse('Address parameter is missing.'));
    return;
  }

  const address = decodeURIComponent(addressParam)
    .replaceAll('https://', '')
    .replaceAll('http://', '');

  dns.lookup(address, (err, ip, family) => {
    if (err) {
      callback(null, errorResponse(err.message));
    } else {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({ ip, family }),
      });
    }
  });
};

const errorResponse = (message, statusCode = 444) => {
  return {
    statusCode: statusCode,
    body: JSON.stringify({ error: message }),
  };
};
