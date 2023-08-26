const commonMiddleware = require('./_common/middleware');

const axios = require('axios');
const xml2js = require('xml2js');

const handler = async (url) => {
  let sitemapUrl = `${url}/sitemap.xml`;

  try {
    // Try to fetch sitemap directly
    let sitemapRes;
    try {
      sitemapRes = await axios.get(sitemapUrl, { timeout: 5000 });
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // If sitemap not found, try to fetch it from robots.txt
        const robotsRes = await axios.get(`${url}/robots.txt`, { timeout: 5000 });
        const robotsTxt = robotsRes.data.split('\n');

        for (let line of robotsTxt) {
          if (line.toLowerCase().startsWith('sitemap:')) {
            sitemapUrl = line.split(' ')[1].trim();
            break;
          }
        }

        if (!sitemapUrl) {
          return {
            statusCode: 404,
            body: JSON.stringify({ skipped: 'No sitemap found' }),
          };
        }

        sitemapRes = await axios.get(sitemapUrl, { timeout: 5000 });
      } else {
        throw error; // If other error, throw it
      }
    }

    const parser = new xml2js.Parser();
    const sitemap = await parser.parseStringPromise(sitemapRes.data);

    return {
      statusCode: 200,
      body: JSON.stringify(sitemap),
    };
  } catch (error) {
    // If error occurs
    console.log(error.message);
    if (error.code === 'ECONNABORTED') {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Request timed out' }),
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }
  }
};

exports.handler = commonMiddleware(handler);
