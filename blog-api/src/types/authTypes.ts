import { Request } from 'express';
import { User as PrismaUser } from '@prisma/client';

// Use Prisma's generated User type as the base
export type User = PrismaUser;

// Auth-specific user type - only the fields we need for auth
export type AuthUser = Pick<PrismaUser, 'id' | 'email' | 'username' | 'isAdmin'>;

// For the authenticated requests
export interface AuthRequest extends Request {
  user: AuthUser;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: AuthUser;
}

export interface AuthError {
  message: string;
  status?: number;
}
