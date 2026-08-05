import { type Request, type Response, type NextFunction } from 'express';

export const logMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const { method, url } = req;
  console.log(`\n--- ${new Date().toISOString()}::${method}::${url}`);
  next();
};