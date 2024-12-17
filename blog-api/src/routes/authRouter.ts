import express from 'express';
import passport from 'passport';
import { loginUser, registerUser } from '../controllers/authController';
import { authenticateJWT } from '../middleware/authMiddleware';
import { User, AuthError } from '../types/authTypes';

const router = express.Router();

// Public routes
router.post("/register", async (req, res, next) => {
  try {
    await registerUser(req, res);
  } catch (error) {
    next(error);
  }
});

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
    // Attach user to request
    req.user = user;
    // Call the login handler to generate token
    return loginUser(req, res);
  })(req, res, next);
});

// Protected routes
router.get("/logout", authenticateJWT, (req, res) => {
  // With JWT, you don't need server-side logout
  // Client just needs to remove the token
  res.json({ message: "Logged out successfully" });
});

export default router;