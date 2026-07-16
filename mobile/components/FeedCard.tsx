import React from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Heart, Star, ArrowUpRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getRelativeTime } from '../lib/utils';
import { colors, shadows } from '../lib/tokens';
import type { Post } from '../lib/types';

const CARD_HEIGHT = Math.min(Dimensions.get('window').width * 0.92, 340);

interface FeedCardProps {
  post: Post;
  isLiked?: boolean;
  isLiking?: boolean;
  onLikePress: () => void;
  onCommentPress?: () => void;
  onSharePress?: () => void;
  onBookmarkPress?: () => void;
  isBookmarked?: boolean;
  onPress?: () => void;
}

export function FeedCard({
  post,
  isLiked = false,
  isLiking = false,
  onLikePress,
  onBookmarkPress,
  isBookmarked = false,
  onPress,
}: FeedCardProps) {
  const rating = Math.min(5, Math.max(3.5, 3.5 + (post.interactions_count % 15) / 10));
  const reviews = Math.max(12, post.interactions_count * 3 + 8);
  const locationLabel = post.has_filter ? 'Polished' : 'Authentic';

  return (
    <TouchableOpacity
      activeOpacity={0.95}
      onPress={onPress}
      className="mx-6 mb-5 rounded-[24px] overflow-hidden bg-muted border border-border"
      style={[{ height: CARD_HEIGHT }, shadows.card]}
    >
      {post.image_path ? (
        <Image
          source={{ uri: post.image_path }}
          className="absolute inset-0 w-full h-full"
          resizeMode="cover"
        />
      ) : (
        <View className="absolute inset-0 bg-mist items-center justify-center">
          <Text
            className="text-ash text-sm"
            style={{ fontFamily: 'DMSans_500Medium' }}
          >
            No image
          </Text>
        </View>
      )}

      <LinearGradient
        colors={['transparent', 'rgba(24,25,37,0.15)', 'rgba(24,25,37,0.82)']}
        locations={[0.35, 0.55, 1]}
        style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
      />

      {/* Wishlist / like */}
      <TouchableOpacity
        onPress={onLikePress}
        disabled={isLiking}
        activeOpacity={0.8}
        className="absolute top-4 right-4 w-9 h-9 rounded-full items-center justify-center"
        style={{ backgroundColor: 'rgba(255,255,255,0.92)' }}
      >
        <Heart
          size={18}
          color={isLiked ? colors.ember : colors.carbon}
          fill={isLiked ? colors.ember : 'transparent'}
          strokeWidth={2}
        />
      </TouchableOpacity>

      {/* Bookmark shortcut */}
      {onBookmarkPress && (
        <TouchableOpacity
          onPress={onBookmarkPress}
          activeOpacity={0.8}
          className="absolute top-4 left-4 px-3 py-1.5 rounded-full"
          style={{ backgroundColor: 'rgba(255,255,255,0.92)' }}
        >
          <Text
            className="text-[11px] text-carbon"
            style={{ fontFamily: 'DMSans_500Medium', letterSpacing: -0.2 }}
          >
            {isBookmarked ? 'Saved' : locationLabel}
          </Text>
        </TouchableOpacity>
      )}

      {/* Bottom info panel */}
      <View className="absolute left-0 right-0 bottom-0 p-4">
        <View
          className="rounded-[20px] px-4 py-3.5"
          style={{ backgroundColor: 'rgba(24,25,37,0.55)' }}
        >
          <View className="flex-row items-start justify-between mb-1">
            <View className="flex-1 pr-3">
              <Text
                className="text-[12px] text-white/70"
                style={{ fontFamily: 'DMSans_400Regular', letterSpacing: -0.2 }}
              >
                {post.user.name} · {getRelativeTime(post.created_at)}
              </Text>
              <Text
                className="text-[22px] text-white mt-0.5"
                numberOfLines={1}
                style={{
                  fontFamily: 'DMSans_700Bold',
                  letterSpacing: -0.5,
                  lineHeight: 28,
                }}
              >
                {post.caption?.trim() || `Moment by ${post.user.name}`}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-1.5 mb-3">
            <Star size={12} color={colors.amber} fill={colors.amber} />
            <Text
              className="text-[12px]"
              style={{ fontFamily: 'DMSans_700Bold', color: colors.amber }}
            >
              {rating.toFixed(1)}
            </Text>
            <Text
              className="text-[12px] text-white/65 ml-1"
              style={{ fontFamily: 'DMSans_400Regular' }}
            >
              {reviews} reactions
            </Text>
          </View>

          <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.9}
            className="flex-row items-center justify-between bg-lavender rounded-full pl-4 pr-1.5 py-1.5"
          >
            <Text
              className="text-[14px] text-white"
              style={{ fontFamily: 'DMSans_500Medium', letterSpacing: -0.32 }}
            >
              See more
            </Text>
            <View className="w-8 h-8 rounded-full bg-white/20 items-center justify-center">
              <ArrowUpRight size={16} color={colors.paperWhite} strokeWidth={2.4} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}
