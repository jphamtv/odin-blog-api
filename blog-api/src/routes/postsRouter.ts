import express from 'express';
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
router.get('/:id', getPostById);

// Protected routes
router.post('/', authenticateJWT, createPost as RequestHandler[]);
router.put('/:id', authenticateJWT, updatePost as RequestHandler[]);
router.delete('/:id', authenticateJWT, deletePost as RequestHandler);

export default router;