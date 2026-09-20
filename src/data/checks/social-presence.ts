import type { Check } from '.';

export default {
  title: 'Social Presence',
  categories: ['security'],
  summary: 'Social accounts the site claims, and whether they link back',
  description:
    'Finds the social accounts a site says are its own, by reading its meta tags, ' +
    'structured data and rel="me" links, then looks each one up on the network itself. ' +
    'Bluesky is also checked against the domain directly, because there a handle can be ' +
    'the domain name. Every lookup uses free, public endpoints, so no API keys or ' +
    'accounts are needed.',
  use:
    'Confirms that the accounts a website points to actually exist, and that they point ' +
    'back to the website in return. A mismatch is worth knowing about: phishing pages ' +
    'routinely claim the social accounts of the brand they impersonate, and a link that ' +
    'only goes one way proves nothing about who owns the account.',
  resources: [
    { title: 'IndieWeb: rel-me', link: 'https://indieweb.org/rel-me' },
    {
      title: 'Mastodon link verification',
      link: 'https://docs.joinmastodon.org/user/profile/#verification',
    },
    {
      title: 'Bluesky domain handles',
      link: 'https://bsky.social/about/blog/4-28-2023-domain-handle-tutorial',
    },
    { title: 'Schema.org sameAs', link: 'https://schema.org/sameAs' },
  ],
  screenshot: 'https://pixelflare.cc/alicia/web-check/wc-social',
} satisfies Check;
