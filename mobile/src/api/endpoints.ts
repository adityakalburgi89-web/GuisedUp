import { api } from './client';
import type {
  Post,
  PaginatedResponse,
  InteractionType,
} from '../types';

export const feedApi = {
  getFeed: (page = 1, perPage = 10) =>
    api.get<PaginatedResponse<Post>>('/feed', { page, per_page: perPage }),
};

export const searchApi = {
  search: (query: string, page = 1, perPage = 10) =>
    api.get<PaginatedResponse<Post>>('/search', {
      q: query,
      page,
      per_page: perPage,
    }),
};

export const interactionApi = {
  create: (userId: number, postId: number, type: InteractionType) =>
    api.post<Post>('/interactions', {
      user_id: userId,
      post_id: postId,
      type,
    }),
};
