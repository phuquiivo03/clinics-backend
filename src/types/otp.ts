import type { ObjectId } from 'mongoose';

export interface OTP {
  _id: ObjectId;
  code: string;
  email: string;
  createAt: Date;
}
