import axios from 'axios';
import middleware from './_common/middleware.js';

const headersHandler = async (url, event, context) => {
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

export const handler = middleware(headersHandler);
export default handler;
