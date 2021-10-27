import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { logger } from './logger';

export async function isLoggedIn(req: Request, res: Response, next: NextFunction) {
  try {
    const token = extractToken(req);
    if (!token) {
      return res.status(401).json({ message: 'Permission Denied' });
    }
    const tokenInfo = await verifyToken(token);
    req.user = tokenInfo.id;
    return next();
  } catch (err) {
    logger.info(err);
    return res.status(401).json({ message: 'Permission Denied' });
  }
}

export function extractToken(req: Request) {
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

export async function verifyToken(token: string) {
  return (await jwt.verify(token, process.env.JWT_SECRET!)) as JwtPayload;
}
