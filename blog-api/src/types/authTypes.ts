import { Request } from 'express';

export interface User {
  id: string;
  email: string;
  username: string;
  password: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  username: string;
  isAdmin: boolean;
}

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

export interface AuthRequest extends Request {
  user: {
    id: string;
    username: string;
    isAdmin: boolean;
  }
}