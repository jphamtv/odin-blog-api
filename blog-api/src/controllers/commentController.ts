import { Request, Response, RequestHandler } from "express";
import { body, validationResult } from "express-validator";
import {
  create,
  getAll,
  getById,
  update,
  deleteById,
} from "../models/commentModel";
import { AuthRequest } from "../types/authTypes";

const validateComment = [
  body("text")
    .trim()
    .isLength({ min: 1 })
    .withMessage(`Comment content cannot be empty`),
];

export const createComment = [
  ...validateComment,
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { text } = req.body;
      const comment = await create(text, req.user.id, req.params.postId);
      res.json(comment);
    } catch (err) {
      console.error("Create comment error: ", err);
      res.status(500).json({ message: "Error creating comment" });
    }
  },
] as RequestHandler[];

export const getAllComments = async (req: Request, res: Response) => {
  try {
    const comments = await getAll(req.params.postId);
    res.json(comments);
  } catch (err) {
    console.error("Fetching comments error: ", err);
    res.status(500).json({ message: "Error fetching comments" });
  }
};

export const updateComment = [
  ...validateComment,
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const commentId = req.params.id;
      const existingComment = await getById(commentId);

      if (!existingComment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      if (existingComment.userId !== req.user.id) {
        return res
          .status(403)
          .json({ message: "Not authorized to edit this comment" });
      }

      const { text } = req.body;
      const comment = await update(commentId, text);

      res.json(comment);
    } catch (err) {
      console.error("Update comment error: ", err);
      res.status(500).json({ message: "Error updating comment" });
    }
  },
] as RequestHandler[];

export const deleteComment = async (req: AuthRequest, res: Response) => {
  try {
    const existingComment = await getById(req.params.id);

    if (!existingComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (!(existingComment.userId === req.user.id || req.user.isAdmin)) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this comment" });
    }

    await deleteById(req.params.id);
    res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error("Delete error: ", err);
    res.status(500).json({ message: "Error deleting comment" });
  }
};
