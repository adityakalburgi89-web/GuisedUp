import React, { useState, useCallback } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Text,
  Keyboard,
  ScrollView,
} from 'react-native';
import { Stack } from 'expo-router';
import { useFeed, useSearch, useInteractions } from '../lib/hooks';
import { AppLayout } from '../components/AppLayout';
import { Header } from '../components/Header';
import { SearchBar } from '../components/SearchBar';
import { FeedCard } from '../components/FeedCard';
import { BottomNavigation } from '../components/BottomNavigation';
import { FloatingActionButton } from '../components/FloatingActionButton';
import { LoadingSkeleton, EmptyState, ErrorState } from '../components/FeedbackStates';
import type { Post } from '../lib/types';

const DEFAULT_USER_ID = 1;

export default function Screen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
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

  const handleBookmark = useCallback(
    (post: Post) => {
      setBookmarkedPosts((prev) => ({
        ...prev,
        [post.id]: !prev[post.id],
      }));
    },
    [],
  );

  const renderPost = useCallback(
    ({ item }: { item: Post }) => (
      <FeedCard
        post={item}
        isLiked={false} // Mock liked state, or derived if API supported it
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

  // Mock list of stories to give a premium feel
  const stories = [
    { id: 1, name: 'Ava', active: true },
    { id: 2, name: 'Ben', active: true },
    { id: 3, name: 'Chloe', active: false },
    { id: 4, name: 'Daniel', active: false },
    { id: 5, name: 'Emma', active: true },
    { id: 6, name: 'Felix', active: false },
  ];

  const renderListHeader = () => (
    <View>
      <SearchBar
        value={searchQuery}
        onChangeText={handleSearch}
        onClear={handleClear}
      />

      {/* Stories Carousel */}
      {!isSearching && (
        <View className="mb-4">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24, gap: 16 }}
            className="py-2"
          >
            {/* User "Add Story" */}
            <View className="items-center">
              <View className="w-16 h-16 rounded-full bg-gray-100 border border-gray-200 items-center justify-center">
                <Text className="text-xl font-bold text-gray-500">+</Text>
              </View>
              <Text className="text-xs font-semibold text-muted-foreground mt-1.5">You</Text>
            </View>

            {/* Friend Stories */}
            {stories.map((story) => (
              <View key={story.id} className="items-center">
                <View className={`w-16 h-16 rounded-full p-[2px] items-center justify-center ${story.active ? 'border-2 border-secondary' : 'border border-border/80'}`}>
                  <View className="w-full h-full rounded-full bg-primary/10 items-center justify-center border border-white">
                    <Text className="text-sm font-bold text-primary">
                      {story.name.charAt(0)}
                    </Text>
                  </View>
                </View>
                <Text className="text-xs font-semibold text-foreground mt-1.5">{story.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {isSearching && searchQuery.trim().length > 0 && (
        <View className="px-6 py-2">
          <Text className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            Search results for "{searchQuery}"
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <AppLayout>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* App Header */}
      <Header 
        userName="Aditya"
        onNotificationsPress={() => console.log('Notifications pressed')}
      />

      {/* Main Feed Content */}
      {currentLoading && currentData.length === 0 ? (
        <View className="flex-1">
          {renderListHeader()}
          <LoadingSkeleton count={3} />
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
          contentContainerStyle={{ paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={refresh}
              tintColor="#5B7FFF"
              colors={['#5B7FFF']}
            />
          }
          onEndReached={currentHasMore ? currentLoadMore : undefined}
          onEndReachedThreshold={0.4}
          ListEmptyComponent={
            isSearching && searchQuery.trim().length > 0 && !searchLoading ? (
              <EmptyState
                title="No results found"
                message={`No authentic moments match "${searchQuery}".`}
                onRefresh={handleClear}
              />
            ) : !isSearching ? (
              <EmptyState onRefresh={refresh} isLoading={isRefreshing} />
            ) : null
          }
          ListFooterComponent={
            currentLoadingMore ? (
              <View className="py-6 items-center justify-center">
                <ActivityIndicator size="small" color="#5B7FFF" />
              </View>
            ) : null
          }
        />
      )}

      {/* Floating Action Button */}
      <FloatingActionButton onPress={() => console.log('Create post pressed')} />

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabPress={setActiveTab} />
    </AppLayout>
  );
}
