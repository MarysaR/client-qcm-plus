export const COLORS = [
  'purple',
  'yellow',
  'blue',
  'red',
  'blue',
  'red',
  'pink',
] as const;
export type ColorName = (typeof COLORS)[number];
