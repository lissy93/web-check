import type { Analyzer } from '../types';

const REQUIRED: Array<[string, string]> = [
  ['ogTitle', 'OpenGraph title'],
  ['ogDescription', 'OpenGraph description'],
  ['ogImage', 'OpenGraph image'],
  ['twitterCard', 'Twitter card type'],
];

// Flag missing share-preview metadata
const socialTags: Analyzer = (d) => {
  const missing = REQUIRED.filter(([k]) => !d[k]).map(([, l]) => l);
  if (!missing.length) return [{ severity: 'pass', title: 'Social share metadata complete' }];
  return [
    {
      severity: 'warning',
      title: `Missing social tags: ${missing.length}`,
      detail: `Add ${missing.join(', ')} for cleaner share previews`,
    },
  ];
};

export default socialTags;
