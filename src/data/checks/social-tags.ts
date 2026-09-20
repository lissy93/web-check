import type { Check } from '.';

export default {
  title: 'Social Tags',
  categories: ['seo'],
  summary: 'Open Graph and Twitter tags used when the site is shared',
  description:
    'Reads the meta tags that tell search engines and social platforms how to present ' +
    'the page: title, description, preview image, author, canonical URL and linked ' +
    'social accounts. Most follow either the Open Graph or Twitter Card conventions.',
  use:
    'This is how a site describes itself when it thinks a machine is reading. The ' +
    'preview title and description often differ from the on-page copy, and the tags ' +
    'regularly name authors, social accounts or a parent organisation that appear ' +
    'nowhere else.',
  resources: [
    { title: 'SocialSharePreview.com', link: 'https://socialsharepreview.com/' },
    {
      title: 'The guide to social meta tags',
      link: 'https://css-tricks.com/essential-meta-tags-social-media/',
    },
    { title: 'Web.dev metadata tags', link: 'https://web.dev/learn/html/metadata/' },
    { title: 'Open Graph Protocol', link: 'https://ogp.me/' },
    {
      title: 'Twitter Cards',
      link: 'https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards',
    },
    {
      title: 'Facebook Open Graph',
      link: 'https://developers.facebook.com/docs/sharing/webmasters',
    },
  ],
  screenshot: 'https://pixelflare.cc/alicia/web-check/wc-social',
} satisfies Check;
