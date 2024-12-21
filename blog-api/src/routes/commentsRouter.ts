import express, { RequestHandler } from 'express';
import {
  createComment,
  getAllComments,
  updateComment,
  deleteComment
} from '../controllers/commentController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.get('/posts/:postId/comments', getAllComments);

// Protected routes
router.post('/posts/:postId/comments', authenticateJWT, createComment);
router.put('/comments/:id', authenticateJWT, updateComment);
router.delete('/comments/:id', authenticateJWT, deleteComment as unknown as RequestHandler);

export default router;