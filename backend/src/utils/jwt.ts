import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.ts';
import type { UserPayload } from '../types/user.types.ts';

export const generateToken = (payload: UserPayload) => jwt.sign(payload, ENV.JWT_SECRET, { expiresIn: '1d' });
export const verifyToken = (token: string): UserPayload => jwt.verify(token, ENV.JWT_SECRET) as UserPayload;