const middleware = require('./_common/middleware');

const axios = require('axios');
const xml2js = require('xml2js');

const handler = async (url) => {
  let sitemapUrl = `${url}/sitemap.xml`;

  const hardTimeOut = 5000;

  try {
    // Try to fetch sitemap directly
    let sitemapRes;
    try {
      sitemapRes = await axios.get(sitemapUrl, { timeout: hardTimeOut });
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // If sitemap not found, try to fetch it from robots.txt
        const robotsRes = await axios.get(`${url}/robots.txt`, { timeout: hardTimeOut });
        const robotsTxt = robotsRes.data.split('\n');

        for (let line of robotsTxt) {
          if (line.toLowerCase().startsWith('sitemap:')) {
            sitemapUrl = line.split(' ')[1].trim();
            break;
          }
        }

        if (!sitemapUrl) {
          return { skipped: 'No sitemap found' };
        }

        sitemapRes = await axios.get(sitemapUrl, { timeout: hardTimeOut });
      } else {
        throw error; // If other error, throw it
      }
    }

    const parser = new xml2js.Parser();
    const sitemap = await parser.parseStringPromise(sitemapRes.data);

    return sitemap;
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      return { error: `Request timed-out after ${hardTimeOut}ms` };
    } else {
      return { error: error.message };
    }
  }
};

module.exports = middleware(handler);
module.exports.handler = middleware(handler);

