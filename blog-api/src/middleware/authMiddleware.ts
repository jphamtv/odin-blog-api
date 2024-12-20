import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

// Basic JWT authentication
export const authenticateJWT = passport.authenticate('jwt', { session: false });

// Check if user is admin
export const isAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({
      message: 'Admin access required'
    })
  }
  next();
}; 

export const authenticateAdmin = [authenticateJWT, isAdmin];