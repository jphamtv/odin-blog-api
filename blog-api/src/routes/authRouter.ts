import express, { Request, Response, NextFunction } from 'express';
import passport from 'passport';

const router = express.Router();

// Middleware
function checkAuth(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return res.status(403).json({ message: "Already authenticated" });
  }
  next();
}

// Public routes
router.post("/register", checkAuth, async (req, res, next) => {
  try {
    await registerUser(req, res);
  } catch (error) {
    next(error);
  }
});

router.post("/login", checkAuth, (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: "Authentication error" });
    }
    if (!user) {
      return res
        .status(401)
        .json({ message: info.message || "Invalid credentials" });
    }
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ message: "Error logging in" });
      }
      return res.json({
        message: "Logged in successfully",
        user: { id: user.id, email: user.email },
      });
    });
  })(req, res, next);
});

// Protected routes
router.get("/logout", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  req.logout((error) => {
    if (error) {
      return res.status(500).json({ message: "Error logging out" });
    }
    res.json({ message: "Logged out successfully" });
  });
});

module.exports = router;