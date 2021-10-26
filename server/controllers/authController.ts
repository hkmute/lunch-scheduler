import { AuthService } from '../services/authService';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { extractToken, verifyToken } from '../utils/jwt';

export function AuthController(service: ReturnType<typeof AuthService>) {
  return Object.freeze({
    testLogin: (req: Request, res: Response) => {
      res.json({ message: req.user });
    },

    getUserInfoById: async (req: Request, res: Response) => {
      try {
        const token = extractToken(req);
        if (!token) {
          return res.status(401).json({ message: 'No token' });
        }
        const tokenInfo = await verifyToken(token);
        const userInfo = await service.getUserInfoById(tokenInfo.id);
        return res.json({ data: userInfo });
      } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
      }
    },

    googleLogin: async (req: Request, res: Response) => {
      try {
        const authCode = req.body.authCode;
        const userGoogleInfo = await service.decodeGoogleToken(authCode);
        const userInfo = await service.getUserInfoByEmail(userGoogleInfo.email);
        if (!userInfo) {
          const userId = await service.createNewUser({ email: userGoogleInfo.email, name: userGoogleInfo.name });
          const token = jwt.sign({ id: userId }, process.env.JWT_SECRET!, { expiresIn: '7d' });
          return res.json({
            token,
            data: { name: userGoogleInfo.name },
          });
        }
        const token = jwt.sign({ id: userInfo.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
        return res.json({
          token,
          data: { name: userInfo.name },
        });
      } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'internal server error' });
        return;
      }
    },
  });
}
