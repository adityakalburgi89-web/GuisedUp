export const colors = {
  primary: '#111111',
  primaryLight: '#838282',
  primaryDark: '#000000',
  background: '#f2f2f2',
  surface: '#ffffff',
  surfaceLight: '#eaeaea',
  text: '#111111',
  textSecondary: '#838282',
  textTertiary: '#b6b5b5',
  border: 'rgba(17, 17, 17, 0.08)',
  error: '#e11d48',
  errorLight: '#fda4af',
  success: '#16a34a',
  warning: '#ca8a04',
  skeleton: '#eaeaea',
  skeletonHighlight: '#f5f5f5',
  overlay: 'rgba(17, 17, 17, 0.5)',
  heart: '#111111',
  heartInactive: '#838282',
  cardShadow: 'rgba(17,17,17,0.03)',
} as const;

export type ColorKey = keyof typeof colors;
