import { useState, useCallback, useEffect, useRef } from 'react';
import { feedApi } from '../api';
import type { Post } from '../types';

interface UseFeedReturn {
  posts: Post[];
  isLoading: boolean;
  isLoadingMore: boolean;
  isRefreshing: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
  retry: () => void;
}

export function useFeed(perPage = 10): UseFeedReturn {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const pageRef = useRef(1);
  const loadingRef = useRef(false);
  const initialLoadDone = useRef(false);

  const fetchPage = useCallback(
    async (page: number, append: boolean) => {
      if (loadingRef.current) return;
      loadingRef.current = true;

      try {
        const response = await feedApi.getFeed(page, perPage);
        setPosts((prev) =>
          append ? [...prev, ...response.data] : response.data,
        );
        setHasMore(response.current_page < response.last_page);
        setError(null);
        pageRef.current = page;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load feed',
        );
      } finally {
        loadingRef.current = false;
      }
    },
    [perPage],
  );

  useEffect(() => {
    if (initialLoadDone.current) return;
    initialLoadDone.current = true;
    setIsLoading(true);
    fetchPage(1, false).finally(() => setIsLoading(false));
  }, [fetchPage]);

  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    fetchPage(pageRef.current + 1, true).finally(() =>
      setIsLoadingMore(false),
    );
  }, [isLoadingMore, hasMore, fetchPage]);

  const refresh = useCallback(() => {
    setIsRefreshing(true);
    fetchPage(1, false).finally(() => setIsRefreshing(false));
  }, [fetchPage]);

  const retry = useCallback(() => {
    if (posts.length === 0) {
      setIsLoading(true);
      fetchPage(1, false).finally(() => setIsLoading(false));
    } else {
      loadMore();
    }
  }, [posts.length, fetchPage, loadMore]);

  return {
    posts,
    isLoading,
    isLoadingMore,
    isRefreshing,
    error,
    hasMore,
    loadMore,
    refresh,
    retry,
  };
}
