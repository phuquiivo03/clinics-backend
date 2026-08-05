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
    const secret = config.jwt.authen.secret;
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

  static startOfDay(date: Date): Date {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    return start;
  }

  static endOfDay(date: Date): Date {
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    return end;
  }

  static getCurrentWeekRange(date: Date): { start: Date; end: Date } {
    const startOfWeek = new Date(date);
    const endOfWeek = new Date(date);
    const day = date.getDay();

    // Set to the start of the week (Sunday)
    startOfWeek.setDate(date.getDate() - day);
    startOfWeek.setHours(0, 0, 0, 0);

    // Set to the end of the week (Saturday)
    endOfWeek.setDate(date.getDate() + (6 - day));
    endOfWeek.setHours(23, 59, 59, 999);

    return { start: startOfWeek, end: endOfWeek };
  }
}

export default UtilsService;
