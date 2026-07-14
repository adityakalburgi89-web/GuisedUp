export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Post {
  id: number;
  user_id: number;
  image_path: string;
  original_image_path: string | null;
  caption: string | null;
  has_filter: boolean;
  image_polish_level: number;
  created_at: string;
  updated_at: string;
  user: User;
  interactions_count: number;
}

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: { url: string | null; label: string; active: boolean }[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export type InteractionType = 'like' | 'view';
