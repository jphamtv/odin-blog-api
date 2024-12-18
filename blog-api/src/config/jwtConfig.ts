import { JWTConfig } from '../types/jwtTypes';
import dotenv from 'dotenv';
dotenv.config();

export const jwtConfig: JWTConfig = {
  secret: process.env.JWT_SECRET || 'your-secret-key',
  expiresIn: '24h',
};
