import React, { useState, useCallback } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Text,
  Keyboard,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { useFeed, useSearch, useInteractions } from '../lib/hooks';
import { AppLayout } from '../components/AppLayout';
import { Header } from '../components/Header';
import { SearchBar } from '../components/SearchBar';
import { FeedCard } from '../components/FeedCard';
import { BottomNavigation } from '../components/BottomNavigation';
import { FloatingActionButton } from '../components/FloatingActionButton';
import { LoadingSkeleton, EmptyState, ErrorState } from '../components/FeedbackStates';
import { colors } from '../lib/tokens';
import type { Post } from '../lib/types';

const DEFAULT_USER_ID = 1;

const CATEGORIES = ['For You', 'Friends', 'Trending', 'Nearby', 'Saved'];

export default function Screen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('For You');
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Record<number, boolean>>({});

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

  const handleBookmark = useCallback((post: Post) => {
    setBookmarkedPosts((prev) => ({
      ...prev,
      [post.id]: !prev[post.id],
    }));
  }, []);

  const handleTabPress = useCallback(
    (tab: string) => {
      setActiveTab(tab);
      if (tab === 'more') {
        router.push('/chats' as any);
      }
      if (tab === 'activity') {
        router.push('/travel' as any);
      }
    },
    [],
  );

  const renderPost = useCallback(
    ({ item }: { item: Post }) => (
      <FeedCard
        post={item}
        isLiked={false}
        isLiking={liking[item.id] ?? false}
        onLikePress={() => handleLike(item)}
        isBookmarked={bookmarkedPosts[item.id] ?? false}
        onBookmarkPress={() => handleBookmark(item)}
        onCommentPress={() => console.log('Comment pressed on post', item.id)}
        onSharePress={() => console.log('Share pressed on post', item.id)}
      />
    ),
    [liking, bookmarkedPosts, handleLike, handleBookmark],
  );

  const currentData = isSearching ? searchResults : posts;
  const currentLoading = isSearching ? searchLoading : isLoading;
  const currentLoadingMore = isSearching ? searchLoadingMore : isLoadingMore;
  const currentError = isSearching ? searchError : error;
  const currentHasMore = isSearching ? searchHasMore : hasMore;
  const currentLoadMore = isSearching ? searchLoadMore : loadMore;

  const renderListHeader = () => (
    <View>
      <SearchBar
        value={searchQuery}
        onChangeText={handleSearch}
        onClear={handleClear}
        onFilterPress={() => console.log('Filter pressed')}
      />

      {!isSearching && (
        <>
          <Text
            className="text-[20px] text-foreground px-6 mb-4"
            style={{
              fontFamily: 'DMSans_700Bold',
              letterSpacing: -0.4,
              lineHeight: 26,
            }}
          >
            Discover moments
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24, gap: 10, paddingBottom: 4 }}
            className="mb-5"
          >
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setSelectedCategory(cat)}
                  activeOpacity={0.85}
                  className={`px-5 py-2.5 rounded-full border ${
                    active
                      ? 'bg-carbon border-carbon'
                      : 'bg-background border-border'
                  }`}
                >
                  <Text
                    className={`text-[13px] ${active ? 'text-white' : 'text-ash'}`}
                    style={{
                      fontFamily: 'DMSans_500Medium',
                      letterSpacing: -0.2,
                    }}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </>
      )}

      {isSearching && searchQuery.trim().length > 0 && (
        <View className="px-6 pb-3">
          <Text
            className="text-[12px] text-ash"
            style={{ fontFamily: 'DMSans_500Medium', letterSpacing: -0.2 }}
          >
            Results for “{searchQuery}”
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <AppLayout>
      <Stack.Screen options={{ headerShown: false }} />

      <Header
        userName="Aditya"
        subtitle="Welcome to GuisedUp"
        onAvatarPress={() => router.push('/chats' as any)}
      />

      {currentLoading && currentData.length === 0 ? (
        <View className="flex-1">
          {renderListHeader()}
          <LoadingSkeleton count={2} />
        </View>
      ) : currentError && currentData.length === 0 ? (
        <View className="flex-1">
          {renderListHeader()}
          <ErrorState message={currentError} onRetry={retry} />
        </View>
      ) : (
        <FlatList
          data={currentData}
          renderItem={renderPost}
          keyExtractor={(item) => String(item.id)}
          ListHeaderComponent={renderListHeader}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={refresh}
              tintColor={colors.lavender}
              colors={[colors.lavender]}
            />
          }
          onEndReached={currentHasMore ? currentLoadMore : undefined}
          onEndReachedThreshold={0.4}
          ListEmptyComponent={
            isSearching && searchQuery.trim().length > 0 && !searchLoading ? (
              <EmptyState
                title="No results found"
                message={`No moments match “${searchQuery}”.`}
                onRefresh={handleClear}
              />
            ) : !isSearching ? (
              <EmptyState onRefresh={refresh} isLoading={isRefreshing} />
            ) : null
          }
          ListFooterComponent={
            currentLoadingMore ? (
              <View className="py-6 items-center justify-center">
                <ActivityIndicator size="small" color={colors.lavender} />
              </View>
            ) : null
          }
        />
      )}

      <FloatingActionButton onPress={() => console.log('Create post pressed')} />
      <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />
    </AppLayout>
  );
}
