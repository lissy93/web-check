import axios from 'axios';
import xml2js from 'xml2js';
import middleware from './_common/middleware.js';

const sitemapHandler = async (url) => {
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

export const handler = middleware(sitemapHandler);
export default handler;

