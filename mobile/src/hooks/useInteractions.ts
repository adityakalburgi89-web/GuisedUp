import { useState, useCallback } from 'react';
import { interactionApi } from '../api';
import type { InteractionType } from '../types';

interface UseInteractionsReturn {
  liking: Record<number, boolean>;
  likePost: (userId: number, postId: number) => Promise<void>;
}

export function useInteractions(): UseInteractionsReturn {
  const [liking, setLiking] = useState<Record<number, boolean>>({});

  const likePost = useCallback(
    async (userId: number, postId: number) => {
      if (liking[postId]) return;
      setLiking((prev) => ({ ...prev, [postId]: true }));
      try {
        await interactionApi.create(userId, postId, 'like' as InteractionType);
      } catch {
        // Silently fail - user can retry
      } finally {
        setLiking((prev) => ({ ...prev, [postId]: false }));
      }
    },
    [liking],
  );

  return { liking, likePost };
}
