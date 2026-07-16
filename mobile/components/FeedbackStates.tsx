import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { AlertCircle, Inbox, RefreshCw } from 'lucide-react-native';
import { colors } from '../lib/tokens';

interface SkeletonBlockProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  className?: string;
}

function SkeletonBlock({ width = '100%', height = 16, borderRadius = 8, className = '' }: SkeletonBlockProps) {
  const opacity = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.35,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={{ width: width as any, height, borderRadius, opacity, backgroundColor: colors.fog }}
      className={className}
    />
  );
}

export function PostSkeleton() {
  return (
    <View className="mx-6 mb-5 rounded-[24px] overflow-hidden border border-border bg-muted h-[320px]">
      <View className="absolute top-4 right-4">
        <SkeletonBlock width={36} height={36} borderRadius={18} />
      </View>
      <View className="absolute left-4 right-4 bottom-4">
        <View className="rounded-[20px] bg-carbon/40 p-4 gap-2">
          <SkeletonBlock width={100} height={12} borderRadius={6} />
          <SkeletonBlock width="80%" height={22} borderRadius={8} />
          <SkeletonBlock width={140} height={12} borderRadius={6} />
          <SkeletonBlock width="100%" height={40} borderRadius={9999} />
        </View>
      </View>
    </View>
  );
}

export function LoadingSkeleton({ count = 3 }: { count?: number }) {
  return (
    <View className="py-2">
      {Array.from({ length: count }).map((_, i) => (
        <PostSkeleton key={i} />
      ))}
    </View>
  );
}

interface EmptyStateProps {
  title?: string;
  message?: string;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export function EmptyState({
  title = 'No moments yet.',
  message = 'Be the first to share something real with your friends.',
  onRefresh,
  isLoading = false,
}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center p-8 mt-10">
      <View className="w-16 h-16 items-center justify-center rounded-full bg-mint-wash mb-5">
        <Inbox size={28} color={colors.lavender} />
      </View>
      <Text
        className="text-lg text-foreground text-center"
        style={{ fontFamily: 'DMSans_700Bold', letterSpacing: -0.32 }}
      >
        {title}
      </Text>
      <Text
        className="text-sm text-graphite text-center mt-2 max-w-xs leading-relaxed"
        style={{ fontFamily: 'DMSans_400Regular', letterSpacing: -0.2 }}
      >
        {message}
      </Text>
      {onRefresh && (
        <TouchableOpacity
          onPress={onRefresh}
          disabled={isLoading}
          className="flex-row items-center gap-2 mt-6 px-6 py-3 rounded-full bg-lavender active:opacity-90"
        >
          <RefreshCw size={16} color={colors.paperWhite} />
          <Text
            className="text-white text-sm"
            style={{ fontFamily: 'DMSans_500Medium', letterSpacing: -0.32 }}
          >
            Refresh Feed
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <View className="flex-1 items-center justify-center p-8 mt-10">
      <View className="w-16 h-16 items-center justify-center rounded-full bg-mist border border-border mb-5">
        <AlertCircle size={28} color={colors.ember} />
      </View>
      <Text
        className="text-lg text-foreground text-center"
        style={{ fontFamily: 'DMSans_700Bold', letterSpacing: -0.32 }}
      >
        Something went wrong
      </Text>
      <Text
        className="text-sm text-graphite text-center mt-2 max-w-xs leading-relaxed"
        style={{ fontFamily: 'DMSans_400Regular' }}
      >
        {message}
      </Text>
      {onRetry && (
        <TouchableOpacity
          onPress={onRetry}
          className="flex-row items-center gap-2 mt-6 px-6 py-3 rounded-full bg-lavender active:opacity-90"
        >
          <Text
            className="text-white text-sm"
            style={{ fontFamily: 'DMSans_500Medium', letterSpacing: -0.32 }}
          >
            Try Again
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
