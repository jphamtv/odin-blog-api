import { Response, NextFunction } from "express";
import passport from "passport";
import { AuthRequest } from "../types/authTypes";

// Basic JWT authentication
export const authenticateJWT = [
  passport.authenticate("jwt", { session: false }),
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  },
];

// Check if user is admin
export const isAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

export const authenticateAdmin = [authenticateJWT, isAdmin];
