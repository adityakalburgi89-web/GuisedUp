export const colors = {
  primary: '#6366f1',
  primaryLight: '#818cf8',
  primaryDark: '#4f46e5',
  background: '#0f0f13',
  surface: '#1a1a23',
  surfaceLight: '#24243a',
  text: '#ffffff',
  textSecondary: '#9ca3af',
  textTertiary: '#6b7280',
  border: '#2a2a3d',
  error: '#ef4444',
  errorLight: '#fca5a5',
  success: '#22c55e',
  warning: '#f59e0b',
  skeleton: '#2a2a3d',
  skeletonHighlight: '#3a3a4d',
  overlay: 'rgba(0,0,0,0.5)',
  heart: '#ef4444',
  heartInactive: '#6b7280',
  cardShadow: 'rgba(99,102,241,0.1)',
} as const;

export type ColorKey = keyof typeof colors;
