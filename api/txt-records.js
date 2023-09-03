const dns = require('dns').promises;
const middleware = require('./_common/middleware');

const handler = async (url, event, context) => {
  try {
    const parsedUrl = new URL(url);
    
    const txtRecords = await dns.resolveTxt(parsedUrl.hostname);

    // Parsing and formatting TXT records into a single object
    const readableTxtRecords = txtRecords.reduce((acc, recordArray) => {
      const recordObject = recordArray.reduce((recordAcc, recordString) => {
        const splitRecord = recordString.split('=');
        const key = splitRecord[0];
        const value = splitRecord.slice(1).join('=');
        return { ...recordAcc, [key]: value };
      }, {});
      return { ...acc, ...recordObject };
    }, {});

    return readableTxtRecords;

  } catch (error) {
    if (error.code === 'ERR_INVALID_URL') {
      throw new Error(`Invalid URL ${error}`);
    } else {
      throw error;
    }
  }
};

module.exports = middleware(handler);
module.exports.handler = middleware(handler);
