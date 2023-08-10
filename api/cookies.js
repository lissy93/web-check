const axios = require('axios');
const middleware = require('./_common/middleware');

const handler = async (url, event, context) => {
  try {
    const response = await axios.get(url, {withCredentials: true});
    const cookies = response.headers['set-cookie'];
    return { cookies };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.handler = middleware(handler);
