import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../services/model';
import { logger } from './logger';

export async function isLoggedIn(req: Request, res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({ message: 'Permission Denied' });
  }
  return jwt.verify(token, process.env.JWT_SECRET!, (err, userInfo: User) => {
    if (err) {
      logger.info(err);
      return res.status(401).json({ message: 'Permission Denied' });
    }
    req.user = userInfo;
    return next();
  });
}

function extractToken(req: Request) {
  const auth = req.headers.authorization;
  if (!auth) {
    return;
  }
  const [scheme, token] = auth?.split(' ');
  if (scheme === 'Bearer') {
    return token;
  }
  return;
}
