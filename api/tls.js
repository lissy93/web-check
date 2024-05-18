import axios from 'axios';
import middleware from './_common/middleware.js';

const MOZILLA_TLS_OBSERVATORY_API = 'https://tls-observatory.services.mozilla.com/api/v1';

const tlsHandler = async (url) => {
  try {
    const domain = new URL(url).hostname;
    const scanResponse = await axios.post(`${MOZILLA_TLS_OBSERVATORY_API}/scan?target=${domain}`);
    const scanId = scanResponse.data.scan_id;

    if (typeof scanId !== 'number') {
      return {
        statusCode: 500,
        body: { error: 'Failed to get scan_id from TLS Observatory' },
      };
    }
    const resultResponse = await axios.get(`${MOZILLA_TLS_OBSERVATORY_API}/results?id=${scanId}`);
    return {
      statusCode: 200,
      body: resultResponse.data,
    };
  } catch (error) {
    return { error: error.message };
  }
};

export const handler = middleware(tlsHandler);
export default handler;
