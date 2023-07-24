const { https } = require('follow-redirects');
const { URL } = require('url');

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

exports.handler = async (event, context) => {
  const urlParam = event.queryStringParameters.url;
  if (!urlParam) {
    return { 
      statusCode: 400, 
      body: JSON.stringify({ error: 'Missing url parameter' }) 
    };
  }

  let url;
  try {
    url = new URL(urlParam.includes('://') ? urlParam : 'https://' + urlParam);
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Invalid URL format' }),
    };
  }
  url.pathname = '';
  
  for (let path of SECURITY_TXT_PATHS) {
    try {
      const result = await fetchSecurityTxt(url, path);
      if (result && result.includes('<html')) return {
        statusCode: 200,
        body: JSON.stringify({ isPresent: false }),
      };
      if (result) {
        return {
          statusCode: 200,
          body: JSON.stringify({
            isPresent: true,
            foundIn: path,
            content: result,
            isPgpSigned: isPgpSigned(result),
            fields: parseResult(result),
          }),
        };
      }
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }
  }
  
  return {
    statusCode: 404,
    body: JSON.stringify({ isPresent: false }),
  };
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
