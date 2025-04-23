import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.log('🔴 [AUTH] No authorization header provided');
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      console.log('🔴 [AUTH] Invalid token format');
      res.status(401).json({ error: 'Invalid token format' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as JwtPayload;

    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error('🔴 [AUTH] Error verifying token:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};
