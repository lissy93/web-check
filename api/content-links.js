const axios = require('axios');
const cheerio = require('cheerio');
const urlLib = require('url');

exports.handler = async (event, context) => {
  let url = event.queryStringParameters.url;
  
  // Check if url includes protocol
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'http://' + url;
  }
  
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    const internalLinksMap = new Map();
    const externalLinksMap = new Map();

    $('a[href]').each((i, link) => {
      const href = $(link).attr('href');
      const absoluteUrl = urlLib.resolve(url, href);
      
      if (absoluteUrl.startsWith(url)) {
        const count = internalLinksMap.get(absoluteUrl) || 0;
        internalLinksMap.set(absoluteUrl, count + 1);
      } else if (href.startsWith('http://') || href.startsWith('https://')) {
        const count = externalLinksMap.get(absoluteUrl) || 0;
        externalLinksMap.set(absoluteUrl, count + 1);
      }
    });

    // Convert maps to sorted arrays
    const internalLinks = [...internalLinksMap.entries()].sort((a, b) => b[1] - a[1]).map(entry => entry[0]);
    const externalLinks = [...externalLinksMap.entries()].sort((a, b) => b[1] - a[1]).map(entry => entry[0]);

    if (internalLinks.length === 0 && externalLinks.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          skipped: 'No internal or external links found. '
            + 'This may be due to the website being dynamically rendered, using a client-side framework (like React), and without SSR enabled. '
            + 'That would mean that the static HTML returned from the HTTP request doesn\'t contain any meaningful content for Web-Check to analyze. '
            + 'You can rectify this by using a headless browser to render the page instead.',
          }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ internal: internalLinks, external: externalLinks }),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed fetching data' }),
    };
  }
};
