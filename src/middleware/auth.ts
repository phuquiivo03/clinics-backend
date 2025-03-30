
import { type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { IAuthenJWT } from '../types';
import { userRepository } from '../repositories';
// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // res.send('authMiddleware');
    console.log('middleware', req.signedCookies)
    const authHeader = req.signedCookies.authenToken || req.headers.authorization;
    
    // const token = authHeader.split(' ')[0];
    
    if (!authHeader) {
      res.status(401).json({ message: 'Not authorized, no token' });
      return;
    }

    try {
      const decoded = jwt.verify(authHeader, process.env.JWT_SECRET || 'default_secret') as IAuthenJWT;
      console.log('decode', decoded);
      req.user = await userRepository.findById(decoded.id, {selectFields: "-password"});
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as admin' });
  }
};
