import { User } from './authTypes';
import { Comment } from './commentTypes';

export interface Post {
  id: string;
  title: string;
  text: string;
  isPublished: boolean;
  authorId: string;
  author: User;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  comments?: Comment[];
}

export interface CreatePostInput {
  title: string;
  text: string;
  isPublished?: boolean;
}

export interface UpdatePostInput {
  title?: string;
  text?: string;
  isPublished?: boolean;
}

export interface PostsResponse {
  posts: Post[];
  total: number;
}