import * as cheerio from 'cheerio';
import middleware from './_common/middleware.js';
import { httpGet } from './_common/http.js';
import { upstreamError } from './_common/upstream.js';

const socialTagsHandler = async (url) => {
  let response;
  try {
    response = await httpGet(url);
  } catch (error) {
    return upstreamError(error, 'Social tags fetch');
  }
  try {
    const $ = cheerio.load(response.data);

    const metadata = {
      // Basic meta tags
      title: $('head title').text(),
      description: $('meta[name="description"]').attr('content'),
      keywords: $('meta[name="keywords"]').attr('content'),
      canonicalUrl: $('link[rel="canonical"]').attr('href'),

      // OpenGraph Protocol
      ogTitle: $('meta[property="og:title"]').attr('content'),
      ogType: $('meta[property="og:type"]').attr('content'),
      ogImage: $('meta[property="og:image"]').attr('content'),
      ogUrl: $('meta[property="og:url"]').attr('content'),
      ogDescription: $('meta[property="og:description"]').attr('content'),
      ogSiteName: $('meta[property="og:site_name"]').attr('content'),

      // Twitter Cards
      twitterCard: $('meta[name="twitter:card"]').attr('content'),
      twitterSite: $('meta[name="twitter:site"]').attr('content'),
      twitterCreator: $('meta[name="twitter:creator"]').attr('content'),
      twitterTitle: $('meta[name="twitter:title"]').attr('content'),
      twitterDescription: $('meta[name="twitter:description"]').attr('content'),
      twitterImage: $('meta[name="twitter:image"]').attr('content'),

      // Misc
      themeColor: $('meta[name="theme-color"]').attr('content'),
      robots: $('meta[name="robots"]').attr('content'),
      googlebot: $('meta[name="googlebot"]').attr('content'),
      generator: $('meta[name="generator"]').attr('content'),
      viewport: $('meta[name="viewport"]').attr('content'),
      author: $('meta[name="author"]').attr('content'),
      publisher: $('link[rel="publisher"]').attr('href'),
      favicon: $('link[rel="icon"]').attr('href'),
    };

    const SOCIAL_FIELDS = [
      'title',
      'description',
      'keywords',
      'canonicalUrl',
      'ogTitle',
      'ogImage',
      'ogDescription',
      'ogSiteName',
      'twitterTitle',
      'twitterDescription',
      'twitterImage',
      'author',
      'publisher',
      'themeColor',
    ];
    if (!SOCIAL_FIELDS.some((f) => metadata[f])) {
      return { skipped: 'No social tags found on this page' };
    }
    return metadata;
  } catch (error) {
    return { error: `Failed parsing social tags: ${error.message}` };
  }
};

export const handler = middleware(socialTagsHandler);
export default handler;
