const dns = require('dns').promises;

exports.handler = async (event) => {
  let url = (event.queryStringParameters || event.query).url;
  try {
  url = new URL(url);
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: `Invalid URL ${error}` }),
    };
  }
  try {
    const txtRecords = await dns.resolveTxt(url.hostname);

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

    return {
      statusCode: 200,
      body: JSON.stringify(readableTxtRecords),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
