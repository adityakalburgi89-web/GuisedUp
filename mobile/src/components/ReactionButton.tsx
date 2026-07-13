import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { colors, typography, spacing } from '../theme';

interface ReactionButtonProps {
  count: number;
  isLiked?: boolean;
  isLoading?: boolean;
  onPress: () => void;
}

export function ReactionButton({
  count,
  isLiked = false,
  isLoading = false,
  onPress,
}: ReactionButtonProps) {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      disabled={isLoading}
      activeOpacity={0.7}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={colors.primary} />
      ) : (
        <Text style={[styles.icon, isLiked && styles.liked]}>
          {isLiked ? '♥' : '♡'}
        </Text>
      )}
      <Text style={[styles.count, isLiked && styles.likedCount]}>
        {count}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.surfaceLight,
  },
  icon: {
    fontSize: 18,
    color: colors.heartInactive,
  },
  liked: {
    color: colors.heart,
  },
  count: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  likedCount: {
    color: colors.heart,
  },
});
