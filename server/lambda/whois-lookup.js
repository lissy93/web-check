const net = require('net');
// const { URL } = require('url');

const errorResponse = (message, statusCode = 444) => {
  return {
    statusCode: statusCode,
    body: JSON.stringify({ error: message }),
  };
};

const getBaseDomain = (url) => {
  // Determine whether a protocol is present
  let protocol = '';
  if (url.startsWith('http://')) {
      protocol = 'http://';
  } else if (url.startsWith('https://')) {
      protocol = 'https://';
  }

  // Remove protocol for domain parsing but keep it for final output
  let noProtocolUrl = url.replace(protocol, '');

  // Split on '.' and get the last two sections
  const domainParts = noProtocolUrl.split('.');

  // If there's more than one '.' 
  // then get only the last two parts to ignore subdomains
  if (domainParts.length > 2) {
      return protocol + domainParts.slice(-2).join('.');
  } else {
      return url;
  }
}

exports.handler = async function(event, context) {
  let url = event.queryStringParameters.url;

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

