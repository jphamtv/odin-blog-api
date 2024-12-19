export interface Post {
  id: string;
  title: string;
  text: string;
  isPublished: boolean;
  publishedAt: Date;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}