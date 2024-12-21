import express, { RequestHandler } from 'express';
import {
  createComment,
  getAllComments,
  deleteComment
} from '../controllers/commentController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.get('/', getAllComments);

// Protected routes
router.post('/', authenticateJWT, createComment);
router.delete('/:id', authenticateJWT, deleteComment as unknown as RequestHandler);

export default router;