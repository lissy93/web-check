const net = require('net');
const psl = require('psl');
// const { URL } = require('url');

const errorResponse = (message, statusCode = 444) => {
  return {
    statusCode: statusCode,
    body: JSON.stringify({ error: message }),
  };
};


const getBaseDomain = (url) => {
  let protocol = '';
  if (url.startsWith('http://')) {
      protocol = 'http://';
  } else if (url.startsWith('https://')) {
      protocol = 'https://';
  }
  let noProtocolUrl = url.replace(protocol, '');
  const parsed = psl.parse(noProtocolUrl);
  return protocol + parsed.domain;
};


exports.handler = async function(event, context) {
  const url = (event.queryStringParameters || event.query).url;

  if (!url) {
    return errorResponse('URL query parameter is required.', 400);
  }

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'http://' + url;
  }

  let hostname;
  try {
    hostname = getBaseDomain(new URL(url).hostname);
  } catch (error) {
    return errorResponse(`Unable to parse URL: ${error}`, 400);
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
        resolve(errorResponse(error.message));
      }
    });

    client.on('error', (err) => {
      resolve(errorResponse(err.message, 500));
    });
  });
};

const parseWhoisData = (data) => {

  if (data.includes('No match for')) {
    return { error: 'No matches found for domain in internic database'};
  }
  
  const lines = data.split('\r\n');
  const parsedData = {};

  let lastKey = '';

  for (const line of lines) {
    const index = line.indexOf(':');
    if (index === -1) {
      if (lastKey !== '') {
        parsedData[lastKey] += ' ' + line.trim();
      }
      continue;
    }
    let key = line.slice(0, index).trim();
    const value = line.slice(index + 1).trim();
    if (value.length === 0) continue;
    key = key.replace(/\W+/g, '_');
    lastKey = key;

    parsedData[key] = value;
  }

  return parsedData;
};

