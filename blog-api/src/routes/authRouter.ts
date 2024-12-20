import express, { RequestHandler, Response } from 'express';
import passport from 'passport';
import { registerUser, loginUser, logoutUser } from '../controllers/authController';
import { authenticateJWT } from '../middleware/authMiddleware';
import { User, AuthError, AuthRequest } from '../types/authTypes';

const router = express.Router();

// Public routes
router.post("/register", registerUser as RequestHandler[]);

router.post("/login", (req, res, next) => {
  passport.authenticate("local", { session: false }, (err: AuthError, user: User, info: { message: string }) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res
        .status(401)
        .json({ message: info.message || "Invalid credentials" });
    }

    // Attach user to request if successful
    req.user = user;
    
    // Call the login handler to generate token
    return loginUser(req, res);
  })(req, res, next);
});

// Protected routes
router.get("/logout", authenticateJWT, logoutUser);

export default router;