import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, TouchableWithoutFeedback, Animated } from 'react-native';
import { Heart, MessageSquare, Send, Bookmark } from 'lucide-react-native';
import { colors } from '../lib/tokens';

interface ReactionBarProps {
  count: number;
  isLiked?: boolean;
  isLoading?: boolean;
  onLikePress: () => void;
  onCommentPress?: () => void;
  onSharePress?: () => void;
  onBookmarkPress?: () => void;
  isBookmarked?: boolean;
}

export function ReactionBar({
  count,
  isLiked = false,
  isLoading = false,
  onLikePress,
  onCommentPress,
  onSharePress,
  onBookmarkPress,
  isBookmarked = false,
}: ReactionBarProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (isLoading) return;
    Animated.spring(scale, {
      toValue: 0.85,
      useNativeDriver: true,
      speed: 30,
      bounciness: 12,
    }).start();
  };

  const handlePressOut = () => {
    if (isLoading) return;
    Animated.spring(scale, {
      toValue: 1.0,
      useNativeDriver: true,
      speed: 30,
      bounciness: 12,
    }).start();
  };

  return (
    <View className="flex-row items-center justify-between mt-4 pt-3 border-t border-border">
      <View className="flex-row items-center gap-5">
        <TouchableWithoutFeedback
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={onLikePress}
          disabled={isLoading}
        >
          <Animated.View
            className="flex-row items-center gap-1.5 py-1"
            style={{ transform: [{ scale }] }}
          >
            <Heart
              size={20}
              color={isLiked ? colors.ember : colors.graphite}
              fill={isLiked ? colors.ember : 'transparent'}
            />
            <Text
              className={`text-xs ${isLiked ? 'text-ember' : 'text-graphite'}`}
              style={{ fontFamily: 'DMSans_500Medium', letterSpacing: -0.2 }}
            >
              {count}
            </Text>
          </Animated.View>
        </TouchableWithoutFeedback>

        <TouchableOpacity
          onPress={onCommentPress}
          className="flex-row items-center gap-1.5 py-1 active:opacity-75"
        >
          <MessageSquare size={20} color={colors.graphite} />
          <Text
            className="text-xs text-graphite"
            style={{ fontFamily: 'DMSans_500Medium' }}
          >
            Comment
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onSharePress}
          className="py-1 active:opacity-75"
        >
          <Send size={20} color={colors.graphite} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={onBookmarkPress}
        className="py-1 active:opacity-75"
      >
        <Bookmark
          size={20}
          color={isBookmarked ? colors.lavender : colors.graphite}
          fill={isBookmarked ? colors.lavender : 'transparent'}
        />
      </TouchableOpacity>
    </View>
  );
}
