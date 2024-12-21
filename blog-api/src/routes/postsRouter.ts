import express, { RequestHandler } from 'express';
import {
  createPost,
  getAllAdminPosts,
  getAllPublishedPosts,
  getPostById,
  updatePost,
  deletePost
} from '../controllers/postController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.get('/published', getAllPublishedPosts);
router.get('/published/:id', getPostById as RequestHandler);

// Protected routes
router.get('/admin', authenticateJWT, getAllAdminPosts as unknown as RequestHandler);
router.get('/admin/:id', authenticateJWT, getPostById as unknown as RequestHandler);
router.post('/', authenticateJWT, createPost);
router.put('/:id', authenticateJWT, updatePost);
router.delete('/:id', authenticateJWT, deletePost as unknown as RequestHandler);

export default router;