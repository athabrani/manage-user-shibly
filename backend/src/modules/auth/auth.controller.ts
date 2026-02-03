import express from 'express';
import { prisma } from '../../config/db.ts';
import { comparePassword } from '../../utils/hash.ts';
import { generateToken } from '../../utils/jwt.ts';

type Request = express.Request;
type Response = express.Response;
type NextFunction = express.NextFunction;
type Express = typeof express;

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = await prisma.user.findUnique({ where: { username } });

  if (!user || !(await comparePassword(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = generateToken({ id: user.id, role: user.role, regionCode: user.regionCode ?? '' });
  return res.json({ token, user: { username: user.username, role: user.role, regionCode: user.regionCode } });
};