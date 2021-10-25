import { AuthService } from '../services/authService';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export function AuthController(service: ReturnType<typeof AuthService>) {
  return Object.freeze({
    googleLogin: async (req: Request, res: Response) => {
      try {
        const authCode = req.body.authCode;
        const userGoogleInfo = await service.decodeGoogleToken(authCode);
        const userInfo = await service.getUserInfo(userGoogleInfo.email);
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
