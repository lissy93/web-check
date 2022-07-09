const dns = require('dns');

/* Lambda function to fetch the IP address of a given URL */
exports.handler = function (event, context, callback) {
  const addressParam = event.queryStringParameters.address;
  const address = decodeURIComponent(addressParam)
  .replaceAll('https://', '')
  .replaceAll('http://', '');
  dns.lookup(address, (err, ip, family) => {
    console.log(err);
    if (err) {
      callback(null, {
        statusCode: 405,
        body: JSON.stringify(err),
      })
    } else {
      callback(err, {
        statusCode: 200,
        body: JSON.stringify({ip, family}),
      });
    }
  });
};
