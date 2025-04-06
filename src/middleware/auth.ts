
import { type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { IAuthenJWT } from '../types';
import { userRepository } from '../repositories';
import { CustomExpress } from '../pkg/app/response';
import { ErrorCode } from '../pkg/e/code';
// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const appExpress = new CustomExpress(req, res, next);
  try {
    const authHeader = req.headers.authorization?.split('Bearer ')[1];
    // res.send('authMiddleware');
    // console.log('middleware', req.signedCookies)
    // const authHeader = req.signedCookies.authenToken || req.headers.authorization;
    
    // const token = authHeader.split(' ')[0];
    
    if (!authHeader) {
      appExpress.response401(ErrorCode.UNAUTHORIZED, {})
      return;
    }

    try {
      const decoded = jwt.verify(authHeader, process.env.JWT_SECRET || 'default_secret') as IAuthenJWT;
      if(decoded.expired < Date.now()) {
        appExpress.response401(ErrorCode.TOKEN_EXPIRED, {})
        return;
      }
      req.user = await userRepository.findById(decoded.id, {selectFields: ["-password"]});
      next();
    } catch (error) {
      appExpress.response401(ErrorCode.TOKEN_INVALID, {})
    }
  } catch (error) {
    console.error(error);
    appExpress.response500(ErrorCode.INTERNAL_SERVER_ERROR, {})
  }
};

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const appExpress = new CustomExpress(req, res, next);
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    appExpress.response403(ErrorCode.FORBIDDEN, {})
  }
};
