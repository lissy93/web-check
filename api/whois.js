const net = require('net');
const psl = require('psl');
const axios = require('axios');
const middleware = require('./_common/middleware');

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

const fetchFromInternic = async (hostname) => {
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
        resolve(parsedData);
      } catch (error) {
        reject(error);
      }
    });

    client.on('error', (err) => {
      reject(err);
    });
  });
};

const fetchFromMyAPI = async (hostname) => {
  try {
    const response = await axios.post('https://whois-api-zeta.vercel.app/', {
      domain: hostname
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data from your API:', error.message);
    return null;
  }
};

const handler = async (url) => {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'http://' + url;
  }

  let hostname;
  try {
    hostname = getBaseDomain(new URL(url).hostname);
  } catch (error) {
    throw new Error(`Unable to parse URL: ${error}`);
  }

  const [internicData, whoisData] = await Promise.all([
    fetchFromInternic(hostname),
    fetchFromMyAPI(hostname)
  ]);

  return {
    internicData,
    whoisData
  };
};

module.exports = middleware(handler);
module.exports.handler = middleware(handler);

