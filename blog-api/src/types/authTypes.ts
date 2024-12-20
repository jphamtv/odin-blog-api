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

export interface AuthRequest extends Request {
  user: {
    id: string;
    email: string
    username: string;
    isAdmin: boolean;
  }
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  username: string;
  isAdmin: boolean;
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
