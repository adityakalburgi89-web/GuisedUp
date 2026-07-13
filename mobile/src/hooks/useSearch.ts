import { useState, useCallback, useRef } from 'react';
import { searchApi } from '../api';
import type { Post } from '../types';

interface UseSearchReturn {
  results: Post[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  search: (query: string) => void;
  loadMore: () => void;
  clear: () => void;
}

export function useSearch(perPage = 10): UseSearchReturn {
  const [results, setResults] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const queryRef = useRef('');
  const pageRef = useRef(1);
  const currentPageRef = useRef(1);
  const loadingRef = useRef(false);

  const fetchPage = useCallback(
    async (query: string, page: number, append: boolean) => {
      if (loadingRef.current) return;
      if (!query.trim()) {
        setResults([]);
        return;
      }
      loadingRef.current = true;

      try {
        const response = await searchApi.search(query, page, perPage);
        setResults((prev) =>
          append ? [...prev, ...response.data] : response.data,
        );
        setHasMore(response.current_page < response.last_page);
        setError(null);
        currentPageRef.current = page;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Search failed',
        );
      } finally {
        loadingRef.current = false;
      }
    },
    [perPage],
  );

  const search = useCallback(
    (query: string) => {
      queryRef.current = query;
      if (!query.trim()) {
        setResults([]);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setResults([]);
      pageRef.current = 1;
      fetchPage(query, 1, false).finally(() => setIsLoading(false));
    },
    [fetchPage],
  );

  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMore || !queryRef.current) return;
    setIsLoadingMore(true);
    fetchPage(queryRef.current, currentPageRef.current + 1, true).finally(
      () => setIsLoadingMore(false),
    );
  }, [isLoadingMore, hasMore, fetchPage]);

  const clear = useCallback(() => {
    setResults([]);
    setError(null);
    queryRef.current = '';
    pageRef.current = 1;
  }, []);

  return {
    results,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    search,
    loadMore,
    clear,
  };
}
