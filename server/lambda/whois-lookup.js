const net = require('net');
const { URL } = require('url');

exports.handler = async function(event, context) {
  let url = event.queryStringParameters.url;

  if (!url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'A url query parameter is required' }),
    };
  }

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'http://' + url;
  }

  let hostname;
  try {
    hostname = new URL(url).hostname;
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid url provided' }),
    };
  }

  return new Promise((resolve, reject) => {
    const client = net.createConnection({ port: 43, host: 'whois.internic.net' }, () => {
      client.write(hostname + '\r\n');
    });

    let data = '';
    client.on('data', (chunk) => {
      data += chunk;
    });

    client.on('end', () => {
      try {
        const parsedData = parseWhoisData(data);
        resolve({
          statusCode: 200,
          body: JSON.stringify(parsedData),
        });
      } catch (error) {
        resolve({
          statusCode: 500,
          body: JSON.stringify({ error: error.message }),
        });
      }
    });

    client.on('error', (err) => {
      resolve({
        statusCode: 500,
        body: JSON.stringify({ message: err.message }),
      });
    });
  });
};

const parseWhoisData = (data) => {
  const lines = data.split('\r\n');
  const parsedData = {};

  let lastKey = '';

  for (const line of lines) {
    const index = line.indexOf(':');

    // If this line is a continuation of the previous line
    if (index === -1) {
      if (lastKey !== '') {
        parsedData[lastKey] += ' ' + line.trim();
      }
      continue;
    }

    let key = line.slice(0, index).trim();
    const value = line.slice(index + 1).trim();

    // Ignore lines that are not key-value pairs
    if (value.length === 0) continue;

    // Convert keys to format without spaces or special characters
    key = key.replace(/\W+/g, '_');

    // Store the key to handle multi-line values
    lastKey = key;

    parsedData[key] = value;
  }

  return parsedData;
};

