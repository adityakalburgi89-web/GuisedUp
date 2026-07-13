import { Text, StyleSheet } from 'react-native';
import { colors, typography } from '../theme';

interface RelativeTimeProps {
  date: string;
}

function getRelativeTime(dateStr: string): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  if (diffWeek < 4) return `${diffWeek}w ago`;
  if (diffMonth < 12) return `${diffMonth}mo ago`;
  return new Date(dateStr).toLocaleDateString();
}

export function RelativeTime({ date }: RelativeTimeProps) {
  return (
    <Text style={styles.text}>{getRelativeTime(date)}</Text>
  );
}

const styles = StyleSheet.create({
  text: {
    ...typography.tiny,
    color: colors.textTertiary,
  },
});
