const { https } = require('follow-redirects');
const { URL } = require('url');
const middleware = require('./_common/middleware');

const SECURITY_TXT_PATHS = [
  '/security.txt',
  '/.well-known/security.txt',
];

const parseResult = (result) => {
  let output = {};
  let counts = {};
  const lines = result.split('\n');
  const regex = /^([^:]+):\s*(.+)$/;
  
  for (const line of lines) {
    if (!line.startsWith("#") && !line.startsWith("-----") && line.trim() !== '') {
      const match = line.match(regex);
      if (match && match.length > 2) {
        let key = match[1].trim();
        const value = match[2].trim();
        if (output.hasOwnProperty(key)) {
          counts[key] = counts[key] ? counts[key] + 1 : 1;
          key += counts[key];
        }
        output[key] = value;
      }
    }
  }
  
  return output;
};

const isPgpSigned = (result) => {
  if (result.includes('-----BEGIN PGP SIGNED MESSAGE-----')) {
    return true;
  }
  return false;
};

const handler = async (urlParam) => {

  let url;
  try {
    url = new URL(urlParam.includes('://') ? urlParam : 'https://' + urlParam);
  } catch (error) {
    throw new Error('Invalid URL format');
  }
  url.pathname = '';
  
  for (let path of SECURITY_TXT_PATHS) {
    try {
      const result = await fetchSecurityTxt(url, path);
      if (result && result.includes('<html')) return { isPresent: false };
      if (result) {
        return {
          isPresent: true,
          foundIn: path,
          content: result,
          isPgpSigned: isPgpSigned(result),
          fields: parseResult(result),
        };
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
  
  return { isPresent: false };
};

async function fetchSecurityTxt(baseURL, path) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseURL);
    https.get(url.toString(), (res) => {
      if (res.statusCode === 200) {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          resolve(data);
        });
      } else {
        resolve(null);
      }
    }).on('error', (err) => {
      reject(err);
    });
  });
}

module.exports = middleware(handler);
module.exports.handler = middleware(handler);
