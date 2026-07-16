/** Visitors — Style Reference (hex for Icon props & StyleSheet) */
export const colors = {
  carbon: '#181925',
  paperWhite: '#ffffff',
  linen: '#fafafa',
  mist: '#f5f5f5',
  fog: '#e8e8e8',
  ash: '#999999',
  graphite: '#666666',
  lavender: '#918df6',
  iris: '#9580ff',
  mint: '#33c758',
  mintWash: '#def6e4',
  amber: '#ffa600',
  sky: '#2c78fc',
  magenta: '#d6409f',
  ember: '#ff3e00',
} as const;

export const shadows = {
  subtle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 1,
    elevation: 1,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  nav: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 12,
  },
} as const;
