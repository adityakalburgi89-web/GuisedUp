import { View, Text, Image, StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../theme';
import { ReactionButton } from './ReactionButton';
import { RelativeTime } from './RelativeTime';
import type { Post } from '../types';

interface PostCardProps {
  post: Post;
  isLiked?: boolean;
  isLiking?: boolean;
  onLike: () => void;
}

export function PostCard({ post, isLiked, isLiking, onLike }: PostCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {post.user.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.username}>{post.user.name}</Text>
          <RelativeTime date={post.created_at} />
        </View>
      </View>

      <Image
        source={{ uri: post.image_path }}
        style={styles.image}
        resizeMode="cover"
      />

      {post.caption && (
        <Text style={styles.caption}>{post.caption}</Text>
      )}

      <View style={styles.footer}>
        <ReactionButton
          count={post.interactions_count}
          isLiked={isLiked}
          isLoading={isLiking}
          onPress={onLike}
        />
        {post.has_filter && (
          <View style={styles.filterBadge}>
            <Text style={styles.filterText}>✨ Filtered</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.sm,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...typography.title,
    color: colors.text,
    fontWeight: '700',
  },
  headerInfo: {
    flex: 1,
    gap: 2,
  },
  username: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  image: {
    width: '100%',
    height: 240,
    backgroundColor: colors.skeleton,
  },
  caption: {
    ...typography.body,
    color: colors.textSecondary,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  filterBadge: {
    backgroundColor: colors.surfaceLight,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm + 2,
    borderRadius: borderRadius.full,
  },
  filterText: {
    ...typography.tiny,
    color: colors.primaryLight,
  },
});
