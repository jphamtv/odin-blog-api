// Base Post type
export interface Post {
  id: string;
  title: string;
  text: string;
  isPublished: boolean;
  publishedAt: Date | null;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Type for creating a post
export interface PostCreateInput {
  title: string;
  text: string;
  isPublished?: boolean;
  author: {
    connect: { id: string } // Prisma's way of connecting relations
  }
}

// Type for updating a post
export interface PostUpdateInput {
  title?: string;
  text?: string;
  isPublished?: boolean;
  publishedAt?: Date | null;
}