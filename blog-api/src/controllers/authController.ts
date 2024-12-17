import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'
import { jwtConfig } from '../config/jwtConfig';
import { getByEmail, createNew } from '../models/authModel';
import { User, AuthenticatedRequest, LoginResponse } from '../types/authTypes';

const generateToken = (user: Pick<User, 'id' | 'email'>) => {
  return jwt.sign(
    { id: user.id },
    jwtConfig.secret,
    {expiresIn: jwtConfig.expiresIn}
  );
};


export const loginUser = async (
  req: AuthenticatedRequest,
  res: Response<LoginResponse>
) => {
  try {
    // Passport puts the user on req.user after successful auth
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        message: 'Authentication failed',
        token: '',
        user: null,
      });
    }

    // Generate token
    const token = generateToken(user);

    // Send token and user info
    res.json({
      message: 'Logged in successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
        username: user.username
      }
    });
  } catch (err) {
    console.error('Login error', err);
    res.status(500).json({ message: 'Error during login' });
  }
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const existingUser = await getByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createNew(email, hashedPassword);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Error registering user" });
  }
};


export default { loginUser, registerUser };
