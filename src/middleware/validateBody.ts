import type { Request, Response, NextFunction } from 'express';
import { ZodObject } from 'zod';
import { CustomExpress } from '../pkg/app/response';
import { ErrorCode } from '../pkg/e/code';

export function validateBody<T>(schema: ZodObject<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const appExpress = new CustomExpress(req, res, next);
    const validationResult = schema.safeParse(req.body);
    if (!validationResult.success) {
      appExpress.response400(ErrorCode.INVALID_REQUEST_BODY, validationResult.error);
      return;
    }
    req.body = validationResult.data as T;
    next();
  };
}
