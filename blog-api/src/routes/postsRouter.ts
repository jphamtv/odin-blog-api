import express, { RequestHandler } from 'express';
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost
} from '../controllers/postController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.get('/', getAllPosts);
router.get('/:id', getPostById as RequestHandler);

// Protected routes
router.post('/', authenticateJWT, createPost);
router.put('/:id', authenticateJWT, updatePost);
router.delete('/:id', authenticateJWT, deletePost as unknown as RequestHandler);

export default router;