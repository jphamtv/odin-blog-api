import { Request, Response, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'
import { body, validationResult } from 'express-validator';
import { jwtConfig } from '../config/jwtConfig';
import { getByEmail, createNew } from '../models/authModel';
import { LoginResponse, AuthRequest } from '../types/authTypes';

const validateUser = [
  body('username').trim()
    .isLength({ min: 3, max: 200 }).withMessage(`Username must between 3 and 200 characters`)
    .matches(/^[a-z0-9 '-]+$/i).withMessage('Username contains invalid characters'),
  body('email').trim()
    .isEmail().withMessage(`Invalid email`),
  body('password').trim()
    .isLength({ min: 8 }).withMessage(`Password must be longer than 8 characters`)
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number')
    .matches(/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/).withMessage('Password must contain at least one special character'),
  body('confirm_password').custom((value, { req }) => {
    if (value === req.body.password) {
      return true;
    } else {
      throw new Error(`Passwords do not match`)
    }
  })
];

export const registerUser = [
  validateUser,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      const { username, email, password } = req.body;
      
      // Check if user exists
      const existingUser = await getByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }
      
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await createNew(username, email, hashedPassword);
      
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Error registering user" });
    }
  }
] as RequestHandler[];

const generateToken = (id: string) => {
  return jwt.sign(
    { id },
    jwtConfig.secret,
    {expiresIn: jwtConfig.expiresIn}
  );
};

export const loginUser = async (
  req: AuthRequest,
  res: Response<LoginResponse | { message: string }>
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: 'Authentication failed'
      });
    }

    // Generate token
    const token = generateToken(req.user.id);

    // Send token and user info
    res.json({
      message: 'Logged in successfully',
      token,
      user: {
        id: req.user.id,
        email: req.user.email,
        username: req.user.username,
        isAdmin: req.user.isAdmin
      }
    });
  } catch (err) {
    console.error('Login error', err);
    res.status(500).json({ message: 'Error during login' });
  }
};

export const logoutUser = (_req: Request, res: Response) => {
  res.json({ message: 'Logged out successfully' });
};
