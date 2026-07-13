import { useState, useCallback, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Text,
  Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, spacing } from '../theme';
import { useFeed, useSearch, useInteractions } from '../hooks';
import { PostCard } from '../components/PostCard';
import { SearchBar } from '../components/SearchBar';
import { FeedSkeleton } from '../components/LoadingSkeleton';
import { ErrorState } from '../components/ErrorState';
import { EmptyState } from '../components/EmptyState';
import type { Post } from '../types';

const DEFAULT_USER_ID = 1;

export function FeedScreen() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const {
    posts,
    isLoading,
    isLoadingMore,
    isRefreshing,
    error,
    hasMore,
    loadMore,
    refresh,
    retry,
  } = useFeed(10);

  const {
    results: searchResults,
    isLoading: searchLoading,
    isLoadingMore: searchLoadingMore,
    error: searchError,
    hasMore: searchHasMore,
    search,
    loadMore: searchLoadMore,
    clear: searchClear,
  } = useSearch(10);

  const { liking, likePost } = useInteractions();

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      if (query.trim().length > 0) {
        setIsSearching(true);
        search(query);
      } else {
        setIsSearching(false);
        searchClear();
      }
    },
    [search, searchClear],
  );

  const handleClear = useCallback(() => {
    setSearchQuery('');
    setIsSearching(false);
    searchClear();
    Keyboard.dismiss();
  }, [searchClear]);

  const handleLike = useCallback(
    (post: Post) => {
      likePost(DEFAULT_USER_ID, post.id);
    },
    [likePost],
  );

  const renderPost = useCallback(
    ({ item }: { item: Post }) => (
      <PostCard
        post={item}
        isLiked={false}
        isLiking={liking[item.id] ?? false}
        onLike={() => handleLike(item)}
      />
    ),
    [liking, handleLike],
  );

  const keyExtractor = useCallback(
    (item: Post) => String(item.id),
    [],
  );

  const currentData = isSearching ? searchResults : posts;
  const currentLoading = isSearching ? searchLoading : isLoading;
  const currentLoadingMore = isSearching ? searchLoadingMore : isLoadingMore;
  const currentError = isSearching ? searchError : error;
  const currentHasMore = isSearching ? searchHasMore : hasMore;
  const currentLoadMore = isSearching ? searchLoadMore : loadMore;

  if (currentLoading && currentData.length === 0) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.searchWrapper}>
          <SearchBar
            value={searchQuery}
            onChangeText={handleSearch}
            onClear={handleClear}
          />
        </View>
        <FeedSkeleton count={3} />
      </View>
    );
  }

  if (currentError && currentData.length === 0) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.searchWrapper}>
          <SearchBar
            value={searchQuery}
            onChangeText={handleSearch}
            onClear={handleClear}
          />
        </View>
        <ErrorState message={currentError} onRetry={retry} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <SearchBar
        value={searchQuery}
        onChangeText={handleSearch}
        onClear={handleClear}
      />

      {!isSearching && (
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>EDITORIAL</Text>
          <Text style={styles.headerSubTitle}>DISCOVERY</Text>
        </View>
      )}

      {isSearching && searchQuery.trim().length > 0 && (
        <Text style={styles.searchResultsHeader}>
          Search results for "{searchQuery}"
        </Text>
      )}

      <FlatList
        data={currentData}
        renderItem={renderPost}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        onEndReached={currentHasMore ? currentLoadMore : undefined}
        onEndReachedThreshold={0.3}
        ListEmptyComponent={
          isSearching && searchQuery.trim().length > 0 && !searchLoading ? (
            <EmptyState
              title="No results found"
              message={`No posts match "${searchQuery}". Try a different search term.`}
            />
          ) : !isSearching ? (
            <EmptyState />
          ) : null
        }
        ListFooterComponent={
          currentLoadingMore ? (
            <View style={styles.loader}>
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerTitleContainer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    gap: 0,
  },
  headerTitle: {
    fontSize: 48,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -2.5,
    lineHeight: 44,
  },
  headerSubTitle: {
    fontSize: 48,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -2.5,
    lineHeight: 44,
    opacity: 0.15,
  },
  searchWrapper: {
    paddingTop: spacing.sm,
  },
  searchResultsHeader: {
    ...typography.caption,
    color: colors.textSecondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  list: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
    flexGrow: 1,
  },
  loader: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
});
