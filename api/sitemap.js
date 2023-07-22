const axios = require('axios');
const xml2js = require('xml2js');

exports.handler = async (event) => {
  const baseUrl = event.queryStringParameters.url.replace(/^(?:https?:\/\/)?/i, "");
  const url = baseUrl.startsWith('http') ? baseUrl : `http://${baseUrl}`;
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
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Sitemap not found in robots.txt' }),
      };
    }

    // Fetch sitemap
    const sitemapRes = await axios.get(sitemapUrl);
    const sitemap = await xml2js.parseStringPromise(sitemapRes.data);

    return {
      statusCode: 200,
      body: JSON.stringify(sitemap),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
