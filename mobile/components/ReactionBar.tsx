import React, { useRef } from 'react';
import { View, Text, TouchableWithoutFeedback, Animated } from 'react-native';
import { Heart, MessageSquare, Send, Bookmark } from 'lucide-react-native';

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
    <View className="flex-row items-center justify-between mt-4 pt-3 border-t border-border/40">
      <View className="flex-row items-center gap-6">
        <TouchableWithoutFeedback
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={onLikePress}
          disabled={isLoading}
        >
          <Animated.View 
            className="flex-row items-center gap-1.5 py-1 pr-2 active:opacity-75"
            style={{ transform: [{ scale }] }}
          >
            <Heart 
              size={20} 
              color={isLiked ? '#EF4444' : '#6B7280'} 
              fill={isLiked ? '#EF4444' : 'transparent'} 
            />
            <Text className={`text-xs font-semibold ${isLiked ? 'text-destructive' : 'text-muted-foreground'}`}>
              {count}
            </Text>
          </Animated.View>
        </TouchableWithoutFeedback>

        <TouchableOpacity 
          onPress={onCommentPress}
          className="flex-row items-center gap-1.5 py-1 pr-2 active:opacity-75"
        >
          <MessageSquare size={20} color="#6B7280" />
          <Text className="text-xs font-semibold text-muted-foreground">Comment</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={onSharePress}
          className="flex-row items-center gap-1.5 py-1 pr-2 active:opacity-75"
        >
          <Send size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        onPress={onBookmarkPress}
        className="py-1 pl-2 active:opacity-75"
      >
        <Bookmark 
          size={20} 
          color={isBookmarked ? '#7C5CFF' : '#6B7280'} 
          fill={isBookmarked ? '#7C5CFF' : 'transparent'} 
        />
      </TouchableOpacity>
    </View>
  );
}

// Simple TouchableOpacity implementation inside ReactionBar scope
import { TouchableOpacity } from 'react-native';
