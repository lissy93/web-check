const axios = require('axios');
const middleware = require('./_common/middleware');

const MOZILLA_TLS_OBSERVATORY_API = 'https://tls-observatory.services.mozilla.com/api/v1';

const handler = async (url) => {
  try {
    const domain = new URL(url).hostname;
    const scanResponse = await axios.post(`${MOZILLA_TLS_OBSERVATORY_API}/scan?target=${domain}`);
    const scanId = scanResponse.data.scan_id;

    if (typeof scanId !== 'number') {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to get scan_id from TLS Observatory' }),
      };
    }
    const resultResponse = await axios.get(`${MOZILLA_TLS_OBSERVATORY_API}/results?id=${scanId}`);
    return {
      statusCode: 200,
      body: JSON.stringify(resultResponse.data),
    };
  } catch (error) {
    return { error: error.message };
  }
};

module.exports = middleware(handler);
module.exports.handler = middleware(handler);
