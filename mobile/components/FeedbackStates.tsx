import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { AlertCircle, Inbox, RefreshCw } from 'lucide-react-native';

// ==========================================
// 1. LOADING SKELETON
// ==========================================
interface SkeletonBlockProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  className?: string;
}

function SkeletonBlock({ width = '100%', height = 16, borderRadius = 8, className = '' }: SkeletonBlockProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.6,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
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
      style={{ width: width as any, height, borderRadius, opacity }}
      className={`bg-gray-200 ${className}`}
    />
  );
}

export function PostSkeleton() {
  return (
    <View className="bg-white rounded-[24px] border border-border/60 mx-6 mb-4 p-5 shadow-sm">
      <View className="flex-row items-center gap-3 mb-4">
        <SkeletonBlock width={40} height={40} borderRadius={20} />
        <View className="flex-1 gap-1.5">
          <SkeletonBlock width={120} height={14} />
          <SkeletonBlock width={60} height={10} />
        </View>
      </View>
      <View className="gap-2 mb-4">
        <SkeletonBlock width="100%" height={12} />
        <SkeletonBlock width="90%" height={12} />
      </View>
      <SkeletonBlock width="100%" height={200} borderRadius={16} className="mb-4" />
      <View className="flex-row items-center justify-between pt-3 border-t border-border/40">
        <View className="flex-row items-center gap-6">
          <SkeletonBlock width={45} height={20} borderRadius={10} />
          <SkeletonBlock width={65} height={20} borderRadius={10} />
        </View>
        <SkeletonBlock width={20} height={20} borderRadius={10} />
      </View>
    </View>
  );
}

export function LoadingSkeleton({ count = 3 }: { count?: number }) {
  return (
    <View className="py-4">
      {Array.from({ length: count }).map((_, i) => (
        <PostSkeleton key={i} />
      ))}
    </View>
  );
}

// ==========================================
// 2. EMPTY STATE
// ==========================================
interface EmptyStateProps {
  title?: string;
  message?: string;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export function EmptyState({
  title = 'No authentic moments yet.',
  message = 'Be the first to share a real, unfiltered moment with your friends.',
  onRefresh,
  isLoading = false,
}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center p-8 mt-12">
      <View className="w-16 h-16 items-center justify-center rounded-full bg-secondary/5 border border-secondary/10 mb-5">
        <Inbox size={28} color="#7C5CFF" />
      </View>
      <Text className="text-lg font-bold text-foreground text-center" style={{ fontFamily: 'Inter_700Bold' }}>
        {title}
      </Text>
      <Text className="text-sm font-medium text-muted-foreground text-center mt-2 max-w-xs leading-relaxed">
        {message}
      </Text>
      {onRefresh && (
        <TouchableOpacity
          onPress={onRefresh}
          disabled={isLoading}
          className="flex-row items-center gap-2 mt-6 px-6 py-3 rounded-full bg-primary shadow-sm shadow-primary/20 active:opacity-90"
        >
          <RefreshCw size={16} color="#ffffff" className={isLoading ? 'animate-spin' : ''} />
          <Text className="text-white text-sm font-bold">Refresh Feed</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ==========================================
// 3. ERROR STATE
// ==========================================
interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <View className="flex-1 items-center justify-center p-8 mt-12">
      <View className="w-16 h-16 items-center justify-center rounded-full bg-destructive/5 border border-destructive/10 mb-5">
        <AlertCircle size={28} color="#EF4444" />
      </View>
      <Text className="text-lg font-bold text-foreground text-center" style={{ fontFamily: 'Inter_700Bold' }}>
        Something went wrong
      </Text>
      <Text className="text-sm font-medium text-muted-foreground text-center mt-2 max-w-xs leading-relaxed">
        {message}
      </Text>
      {onRetry && (
        <TouchableOpacity
          onPress={onRetry}
          className="flex-row items-center gap-2 mt-6 px-6 py-3 rounded-full bg-primary shadow-sm shadow-primary/20 active:opacity-90"
        >
          <Text className="text-white text-sm font-bold">Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
