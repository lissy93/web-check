const axios = require('axios');
const cheerio = require('cheerio');
const urlLib = require('url');
const commonMiddleware = require('./_common/middleware');

const handler = async (url) => {
  const response = await axios.get(url);
  const html = response.data;
  const $ = cheerio.load(html);
  const internalLinksMap = new Map();
  const externalLinksMap = new Map();

  // Get all links on the page
  $('a[href]').each((i, link) => {
    const href = $(link).attr('href');
    const absoluteUrl = urlLib.resolve(url, href);
    
    // Check if absolute / relative, append to appropriate map or increment occurrence count
    if (absoluteUrl.startsWith(url)) {
      const count = internalLinksMap.get(absoluteUrl) || 0;
      internalLinksMap.set(absoluteUrl, count + 1);
    } else if (href.startsWith('http://') || href.startsWith('https://')) {
      const count = externalLinksMap.get(absoluteUrl) || 0;
      externalLinksMap.set(absoluteUrl, count + 1);
    }
  });

  // Sort by most occurrences, remove supplicates, and convert to array
  const internalLinks = [...internalLinksMap.entries()].sort((a, b) => b[1] - a[1]).map(entry => entry[0]);
  const externalLinks = [...externalLinksMap.entries()].sort((a, b) => b[1] - a[1]).map(entry => entry[0]);

  return { internal: internalLinks, external: externalLinks };
};

exports.handler = commonMiddleware(handler);
