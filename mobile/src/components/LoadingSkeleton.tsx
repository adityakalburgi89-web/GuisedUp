import { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '../theme';

interface SkeletonBlockProps {
  width?: number | string;
  height?: number;
  style?: object;
}

function SkeletonBlock({ width = '100%', height = 16, style }: SkeletonBlockProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.block,
        { width: width as any, height, opacity },
        style,
      ]}
    />
  );
}

export function PostSkeleton() {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <SkeletonBlock width={40} height={40} style={styles.avatar} />
        <View style={styles.headerText}>
          <SkeletonBlock width={120} height={14} />
          <SkeletonBlock width={80} height={11} style={styles.time} />
        </View>
      </View>
      <SkeletonBlock height={200} style={styles.image} />
      <View style={styles.footer}>
        <SkeletonBlock width={60} height={32} style={styles.button} />
        <SkeletonBlock width={80} height={14} />
      </View>
    </View>
  );
}

export function FeedSkeleton({ count = 3 }: { count?: number }) {
  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, i) => (
        <PostSkeleton key={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
    padding: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.sm,
  },
  avatar: {
    borderRadius: borderRadius.full,
  },
  headerText: {
    flex: 1,
    gap: spacing.xs,
  },
  time: {
    marginTop: 2,
  },
  image: {
    width: '100%',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  button: {
    borderRadius: borderRadius.full,
  },
  block: {
    backgroundColor: colors.skeleton,
    borderRadius: borderRadius.sm,
  },
});
