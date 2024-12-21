import { Request, Response, RequestHandler } from 'express';
import { body, validationResult } from 'express-validator';
import { create, getAll, getById, update, deleteById, getAllPublished } from '../models/postModel';
import { AuthRequest } from '../types/authTypes';

const validateCreatePost = [
  body('title').trim()
    .isLength({ min: 1, max: 200 }).withMessage(`Title must between 1 and 200 characters`)
    .escape(),
  body('text').trim()
    .isLength({ min: 1 }).withMessage(`Post content cannot be empty`)
    .escape()
];

const validateUpdatePost = [
  body('title').trim()
    .optional()
    .notEmpty().withMessage('Title cannot be empty')
    .escape(),
  body('text').trim()
    .optional()
    .notEmpty().withMessage('Post content cannot be empty')
    .escape(),
  body('isPublished')
    .optional()
    .isBoolean().withMessage('isPublished must be true or false')
];

export const createPost = [
  ...validateCreatePost,
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }    
    
    try {
      const { title, text } = req.body;
      const post = await create(title, text, req.user.id);
      res.json(post);
    } catch (err) {
      console.error("Create error: ", err);
      res.status(500).json({ message: "Error creating post" });
    }
  }
] as RequestHandler[];

export const getAllAdminPosts = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const posts = await getAll(userId);
    res.json(posts);
  } catch (err) {
    console.error("Fetching error: ", err);
    res.status(500).json({ message: "Error fetching posts" });
  }
};

export const getAllPublishedPosts = async (req: Request, res: Response) => {
  try {
    const posts = await getAllPublished();
    res.json(posts);
  } catch (err) {
    console.error("Fetching error: ", err);
    res.status(500).json({ message: "Error fetching posts" });
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const post = await getById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (req.path.startsWith('/published')) {
      // For public route, only return published posts
      if (!post.isPublished) {
        return res.status(404).json({ message: "Post not found or not published" });
      }
    } else {
      // For admin route, check if user owns the post
      if (post.authorId !== (req as AuthRequest).user.id) {
        return res.status(403).json({ message: "Not authorized to view this post" });
      }
    }

    res.json(post);
  } catch (err) {
    console.error("Fetching error: ", err);
    res.status(500).json({ message: "Error getting post" });
  }
};
 
export const updatePost = [
  ...validateUpdatePost,
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const postId = req.params.id;
      const existingPost = await getById(postId);

      if (!existingPost) {
        return res.status(404).json({ message: 'Post not found' });
      }

      if (existingPost.authorId !== req.user.id) {
        return res.status(403).json({ message: "Not authorized to update this post" });
      }

      const { title, text, isPublished } = req.body;
      const post = await update(postId, {
        title,
        text,
        isPublished
      });

      res.json(post);
    } catch (err) {
      console.error("Update error: ", err);
      res.status(500).json({ message: "Error updating post" });
    }
  }
] as RequestHandler[];
 
export const deletePost = async (req: AuthRequest, res: Response) => {
  try {
    const existingPost = await getById(req.params.id);

    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (existingPost.authorId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }

    await deleteById(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error("Delete error: ", err);
    res.status(500).json({ message: "Error deleting post" });
  }
 };

