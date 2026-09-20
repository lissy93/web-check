import type { Check } from '.';

export default {
  title: 'Global Ranking',
  categories: ['seo'],
  summary: 'Tranco rank, if the site is in the global top million',
  description:
    "Looks up the domain's position in the Tranco list, which combines rankings from " +
    'Umbrella, Majestic, Quantcast, the Chrome User Experience Report and Cloudflare ' +
    'Radar into one deliberately stable top-million list. Sites outside that million ' +
    'have no rank.',
  use:
    'A rough sense of scale, most useful for comparing domains rather than as a ' +
    'number in isolation. Tranco averages over time, so it moves slowly, which is the ' +
    'point: it resists the day-to-day churn that made earlier lists unusable for ' +
    'research.',
  resources: [
    { title: 'Tranco List', link: 'https://tranco-list.eu/' },
    {
      title: 'Tranco Research Paper',
      link: 'https://tranco-list.eu/assets/tranco-ndss19.pdf',
    },
  ],
  screenshot: 'https://pixelflare.cc/alicia/web-check/wc-rank',
} satisfies Check;
