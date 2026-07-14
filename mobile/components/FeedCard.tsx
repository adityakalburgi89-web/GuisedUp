import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Check } from 'lucide-react-native';
import { getRelativeTime } from '../lib/utils';
import { ReactionBar } from './ReactionBar';
import type { Post } from '../lib/types';

interface FeedCardProps {
  post: Post;
  isLiked?: boolean;
  isLiking?: boolean;
  onLikePress: () => void;
  onCommentPress?: () => void;
  onSharePress?: () => void;
  onBookmarkPress?: () => void;
  isBookmarked?: boolean;
}

export function FeedCard({
  post,
  isLiked = false,
  isLiking = false,
  onLikePress,
  onCommentPress,
  onSharePress,
  onBookmarkPress,
  isBookmarked = false,
}: FeedCardProps) {
  // Check if verified (just mock check: e.g. posts from user with short names, or custom field if exists)
  const isVerified = post.user.name.length < 8; 

  return (
    <View className="bg-white rounded-[24px] border border-border/60 mx-6 mb-4 p-5 shadow-sm">
      {/* Card Header */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-3">
          <View className="w-10 h-10 items-center justify-center rounded-full bg-secondary/10 border border-secondary/20">
            <Text className="text-sm font-bold text-secondary">
              {post.user.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View>
            <View className="flex-row items-center gap-1">
              <Text className="text-sm font-semibold text-foreground" style={{ fontFamily: 'Inter_600SemiBold' }}>
                {post.user.name}
              </Text>
              {isVerified && (
                <View className="w-3.5 h-3.5 items-center justify-center rounded-full bg-primary">
                  <Check size={9} color="#ffffff" strokeWidth={3} />
                </View>
              )}
            </View>
            <Text className="text-xs text-muted-foreground mt-0.5">
              {getRelativeTime(post.created_at)}
            </Text>
          </View>
        </View>
      </View>

      {/* Post Text */}
      {post.caption && (
        <Text className="text-foreground text-sm font-medium leading-relaxed mb-3">
          {post.caption}
        </Text>
      )}

      {/* Post Image */}
      {post.image_path ? (
        <View className="relative w-full h-64 rounded-2xl overflow-hidden bg-muted">
          <Image
            source={{ uri: post.image_path }}
            className="w-full h-full"
            resizeMode="cover"
          />
          {post.has_filter && (
            <View className="absolute top-3 right-3 bg-white/95 px-2.5 py-1 rounded-full border border-border/40 shadow-sm">
              <Text className="text-[10px] font-bold text-foreground">✨ POLISHED</Text>
            </View>
          )}
        </View>
      ) : null}

      {/* Reaction Bar */}
      <ReactionBar
        count={post.interactions_count}
        isLiked={isLiked}
        isLoading={isLiking}
        onLikePress={onLikePress}
        onCommentPress={onCommentPress}
        onSharePress={onSharePress}
        onBookmarkPress={onBookmarkPress}
        isBookmarked={isBookmarked}
      />
    </View>
  );
}
