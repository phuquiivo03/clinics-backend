import type { NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { ZodError, ZodObject } from 'zod';
import { CustomExpress } from '../pkg/app/response';
import { ErrorCode } from '../pkg/e/code';
import { config } from '../config';
class UtilsService {
  // Generate JWT
  static generateAuthenToken(id: string): string {
    let expired = config.jwt.authen.expiresIn;
    const secret = config.jwt.authen.secret;
    // @ts-ignore
    return jwt.sign({ id }, secret, {
      expiresIn: expired,
    });
  }

  static generateToken(id: string): { authenToken: string; refreshToken: string } {
    return {
      authenToken: this.generateAuthenToken(id),
      refreshToken: this.generateRefreshToken(id),
    };
  }

  static generateRefreshToken(id: string): string {
    let expired = config.jwt.refresh.expiresIn;
    const secret = config.jwt.refresh.secret;
    // @ts-ignore
    return jwt.sign({ id }, secret, {
      expiresIn: expired,
    });
  }

  static validateBody<T>(schema: ZodObject<any>, data: any): T | ZodError {
    const validationResult = schema.safeParse(data);
    if (!validationResult.success) {
      return validationResult.error;
    }
    return validationResult.data as T;
  }
}

export default UtilsService;
