import type { NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { ZodError, ZodObject } from 'zod';
import { CustomExpress } from '../pkg/app/response';
import { ErrorCode } from '../pkg/e/code';
class UtilsService {
  // Generate JWT
  static generateToken(id: string): string {
    let expired = process.env.JWT_EXPIRED || '10m';
    const secret = process.env.JWT_SECRET || 'default_secret';
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
