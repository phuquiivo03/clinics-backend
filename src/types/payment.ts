import type { ObjectId } from 'mongoose';
import type { Schedule } from './schedules';
import type { User } from './user';
import type { ConsultationService } from './consultationService';

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
}

export enum PaymentMethod {
  CASH = 'cash',
  BANK_TRANSFER = 'bank_transfer',
  VNPAY = 'vnpay',
  UNKNOWN = 'unknown',
}


export type Payment = {
  _id?: ObjectId;
  schedule: ObjectId | Schedule;
  service: ObjectId | ConsultationService;
  method: PaymentMethod;
  amount: number;
  status: PaymentStatus;
  note?: string;
  user: ObjectId | User;
  paymentId: string;
  createdAt?: Date;
  updatedAt?: Date;
};
