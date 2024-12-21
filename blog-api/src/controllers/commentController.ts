import { Request, Response, RequestHandler } from 'express';
import { body, validationResult } from 'express-validator';
import { create, getAll, getById, deleteById } from '../models/commentModel';
import { AuthRequest } from '../types/authTypes';

const validateCreateComment = [
  body('text').trim()
    .isLength({ min: 1 }).withMessage(`Comment content cannot be empty`)
    .escape()
];

export const createPost = [
  ...validateCreateComment,
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }    
    
    try {
      const { text } = req.body;
      const comment = await create(text, req.user.id, req.params.id);
      res.json(comment);
    } catch (err) {
      console.error("Create comment error: ", err);
      res.status(500).json({ message: "Error creating comment" });
    }
  }
] as RequestHandler[];

export const getAllComments = async (req: Request, res: Response) => {
  try {
    const comments = await getAll(req.params.id);
    res.json(comments);
  } catch (err) {
    console.error("Fetching comments error: ", err);
    res.status(500).json({ message: "Error fetching comments" });
  }
};
 
export const deleteComment = async (req: AuthRequest, res: Response) => {
  try {
    const existingComment = await getById(req.params.id);

    if (!existingComment) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (req.user.id !== existingComment.userId || !req.user.isAdmin ) {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    await deleteById(req.params.id);
    res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    console.error("Delete error: ", err);
    res.status(500).json({ message: "Error deleting comment" });
  }
 };

