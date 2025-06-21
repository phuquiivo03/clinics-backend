import { type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ROLE, type IAuthenJWT } from '../types';
import { userRepository } from '../repositories';
import { CustomExpress } from '../pkg/app/response';
import { ErrorCode } from '../pkg/e/code';
import { config } from '../config';
import redisClient from '../db/redis_connection';
// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
      authenToken?: string;
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const appExpress = new CustomExpress(req, res, next);
  try {
    const authHeader = req.headers.authorization?.split('Bearer ')[1];

    if (!authHeader) {
      appExpress.response401(ErrorCode.UNAUTHORIZED, {});
      return;
    }

    const isBlacklist = await redisClient.get(config.redis.key.authenToken(authHeader));

    if (isBlacklist) {
      appExpress.response401(ErrorCode.UNAUTHORIZED, {
        message: 'Token is blacklisted',
      });
      return;
    }

    try {
      const decoded = jwt.verify(
        authHeader,
        process.env.JWT_SECRET || 'default_secret',
      ) as IAuthenJWT;
      if (decoded.expired < Date.now()) {
        appExpress.response401(ErrorCode.TOKEN_EXPIRED, {});
        return;
      }
      req.authenToken = authHeader;
      req.user = await userRepository.findById(decoded.id, { selectFields: ['-password'] });
      next();
    } catch (error) {
      appExpress.response401(ErrorCode.TOKEN_INVALID, {});
    }
  } catch (error) {
    console.error(error);
    appExpress.response500(ErrorCode.INTERNAL_SERVER_ERROR, {});
  }
};

export const checkRoleOrOwnerData = (roles: ROLE[]) => async (req: Request, res: Response, next: NextFunction) => {
  const appExpress = new CustomExpress(req, res, next);
  if (req.user && roles.includes(req.user.role)) {
    next();
  }
  else if (req.user && req.params.id && req.user._id.toString() === req.params.id) {
    next();
  }
  else {
    appExpress.response403(ErrorCode.FORBIDDEN, {
      message: `Require ${roles.join(', ')} role or owner data`,
    });
  }
}

export const checkRole = (roles: ROLE[]) => (req: Request, res: Response, next: NextFunction) => {
  const appExpress = new CustomExpress(req, res, next);
  if (req.user && roles.includes(req.user.role)) {
    next();
  } else {
    appExpress.response403(ErrorCode.FORBIDDEN, {
      message: `Require ${roles.join(', ')} role`,
    });
  }
};

export const verifyPhoneNumber = async (req: Request, res: Response, next: NextFunction) => {
  const appExpress = new CustomExpress(req, res, next);
  const phoneNumber = req.body.phoneNumber;
};
