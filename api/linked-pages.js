import * as cheerio from 'cheerio';
import urlLib from 'url';
import middleware from './_common/middleware.js';
import { httpGet } from './_common/http.js';
import { upstreamError } from './_common/upstream.js';

const linkedPagesHandler = async (url) => {
  let response;
  try {
    response = await httpGet(url);
  } catch (error) {
    return upstreamError(error, 'Linked pages fetch');
  }
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
  const internalLinks = [...internalLinksMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .map((entry) => entry[0]);
  const externalLinks = [...externalLinksMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .map((entry) => entry[0]);

  if (!internalLinks.length && !externalLinks.length) {
    return {
      skipped:
        'No internal or external links found in the page HTML. ' +
        'This often happens with single-page apps that render content client-side.',
    };
  }
  return { internal: internalLinks, external: externalLinks };
};

export const handler = middleware(linkedPagesHandler);
export default handler;
