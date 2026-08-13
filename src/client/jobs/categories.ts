export const categories = ['security', 'seo', 'server'] as const;

export type CategoryId = (typeof categories)[number];

export const isCategory = (value: string): value is CategoryId =>
  (categories as readonly string[]).includes(value);
