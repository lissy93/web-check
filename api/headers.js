const axios = require('axios');
const middleware = require('./_common/middleware');

const handler = async (url, event, context) => {
  try {
    const response = await axios.get(url, {
      validateStatus: function (status) {
        return status >= 200 && status < 600; // Resolve only if the status code is less than 600
      },
    });

    return response.headers;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = middleware(handler);
module.exports.handler = middleware(handler);
