import { Request } from 'express';

export interface User {
  id: string;
  email: string;
  username: string;
  password: string;
  isAdmin: boolean;
  createAt: Date;
  updatedAt: Date;
}

export interface AuthenticatedUser extends Omit<User, 'password'> { }

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: AuthenticatedUser;
}

export interface AuthError {
  message: string;
  status?: number;
}