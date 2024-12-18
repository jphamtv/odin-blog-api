import dotenv from 'dotenv';
dotenv.config();

export interface JWTConfig {
  secret: string;
  expiresIn: string | number;
}

export const jwtConfig: JWTConfig = {
  secret: process.env.JWT_SECRET || 'your-secret-key',
  expiresIn: '24h',
};