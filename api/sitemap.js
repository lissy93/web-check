const axios = require('axios');
const xml2js = require('xml2js');
const middleware = require('./_common/middleware');

const fetchSitemapHandler = async (url) => {
  let sitemapUrl;

  try {
    // Fetch robots.txt
    const robotsRes = await axios.get(`${url}/robots.txt`);
    const robotsTxt = robotsRes.data.split('\n');

    for (let line of robotsTxt) {
      if (line.startsWith('Sitemap:')) {
        sitemapUrl = line.split(' ')[1];
      }
    }

    if (!sitemapUrl) {
      throw new Error('Sitemap not found in robots.txt');
    }

    // Fetch sitemap
    const sitemapRes = await axios.get(sitemapUrl);
    const sitemap = await xml2js.parseStringPromise(sitemapRes.data);

    return sitemap;
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.handler = middleware(fetchSitemapHandler);
