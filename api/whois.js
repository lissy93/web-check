import net from 'net';
import psl from 'psl';
import axios from 'axios';
import middleware from './_common/middleware.js';
import { createLogger } from './_common/logger.js';

const log = createLogger('whois');

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

const INTERNIC_TIMEOUT = 5000;

const fetchFromInternic = async (hostname) => new Promise((resolve, reject) => {
  const client = net.createConnection(
    { port: 43, host: 'whois.internic.net' },
    () => client.write(hostname + '\r\n'),
  );
  let data = '';
  client.setTimeout(INTERNIC_TIMEOUT);
  client.on('data', (chunk) => { data += chunk; });
  client.on('end', () => {
    try { resolve(parseWhoisData(data)); }
    catch (error) { reject(error); }
  });
  client.on('timeout', () => {
    client.destroy();
    reject(new Error('Internic WHOIS lookup timed out'));
  });
  client.on('error', (err) => { client.destroy(); reject(err); });
});

const fetchFromMyAPI = async (hostname) => {
  try {
    const response = await axios.post('https://whois-api-zeta.vercel.app/', {
      domain: hostname
    });
    return response.data;
  } catch (error) {
    log.debug(`whois proxy fetch failed: ${error.message}`);
    return null;
  }
};

const whoisHandler = async (url) => {
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

  const internicHas = internicData
    && Object.keys(internicData).filter(k => k !== 'error').length > 0;
  const whoisHas = whoisData && Object.keys(whoisData).length > 0;
  if (!internicHas && !whoisHas) {
    return { skipped: 'No WHOIS data available for this domain' };
  }

  return { internicData, whoisData };
};

export const handler = middleware(whoisHandler);
export default handler;

