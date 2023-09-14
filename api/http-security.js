const axios = require('axios');
const middleware = require('./_common/middleware');

const handler = async (url) => {
  const fullUrl = url.startsWith('http') ? url : `http://${url}`;
  
  try {
    const response = await axios.get(fullUrl);
    const headers = response.headers;
    return {
      strictTransportPolicy: headers['strict-transport-security'] ? true : false,
      xFrameOptions: headers['x-frame-options'] ? true : false,
      xContentTypeOptions: headers['x-content-type-options'] ? true : false,
      xXSSProtection: headers['x-xss-protection'] ? true : false,
      contentSecurityPolicy: headers['content-security-policy'] ? true : false,
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

module.exports = middleware(handler);
module.exports.handler = middleware(handler);
