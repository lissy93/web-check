const axios = require('axios');
const middleware = require('./_common/middleware');

const parseRobotsTxt = (content) => {
  const lines = content.split('\n');
  const rules = [];

  lines.forEach(line => {
    line = line.trim();  // This removes trailing and leading whitespaces

    let match = line.match(/^(Allow|Disallow):\s*(\S*)$/i);
    if (match) {
      const rule = {
        lbl: match[1],
        val: match[2],
      };
      
      rules.push(rule);
    } else {
      match = line.match(/^(User-agent):\s*(\S*)$/i);
      if (match) {
        const rule = {
          lbl: match[1],
          val: match[2],
        };
        
        rules.push(rule);
      }
    }
  });
  return { robots: rules };
}

const handler = async function(url) {
  let parsedURL;
  try {
    parsedURL = new URL(url);
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid url query parameter' }),
    };
  }

  const robotsURL = `${parsedURL.protocol}//${parsedURL.hostname}/robots.txt`;

  try {
    const response = await axios.get(robotsURL);

    if (response.status === 200) {
      const parsedData = parseRobotsTxt(response.data);
      if (!parsedData.robots || parsedData.robots.length === 0) {
        return { skipped: 'No robots.txt file present, unable to continue' };
      }
      return parsedData;
    } else {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Failed to fetch robots.txt', statusCode: response.status }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Error fetching robots.txt: ${error.message}` }),
    };
  }
};

module.exports = middleware(handler);
module.exports.handler = middleware(handler);
