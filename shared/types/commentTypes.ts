import { User } from './authTypes';
import { Post } from './postTypes';

export interface Comment {
  id: string;
  text: string;
  userId: string;
  user: User;
  postId: string;
  post?: Post;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentInput {
  text: string;
  postId: string;
}

export interface UpdateCommentInput {
  text: string;
}

export interface CommentsResponse {
  comments: Comment[];
  total: number;
}