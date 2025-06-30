import type { ObjectId } from 'mongoose';
import type { User } from './user';
import type { ConsultationPackage } from './consultationPackage';
import type { ConsultationService } from './consultationService';
import type { Payment } from './payment';

export interface Schedule {
  _id?: ObjectId;
  userId: ObjectId | User;
  weekPeriod: CDateRange;
  dayOffset: number;
  timeOffset: 0 | 1; // 0 for morning, 1 for afternoon
  status: ScheduleStatus;
  type: 'package' | 'services';
  packageInfo: ObjectId | ConsultationPackage;
  services: ScheduleService[]; //  to manage status of examination? which service is completed?
  payments: SchedulePaymentInfo; //payment info -> tổng tiền, tổng tiền đã thanh toán, tổng tiền chưa thanh toán
}



export type SchedulePaymentInfo = {
  payments: ObjectId[] | Payment[];
  totalPrice: number;
  totalPaid: number;
}

 // mới tạo lịch xong -> tạo luôn payments
export interface ScheduleService {
  service: ObjectId | ConsultationService;
  status: ScheduleServiceStatus;
}

export enum ScheduleServiceStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
}

export enum ScheduleStatus {
  CONFIRMED = 'confirmed',
  CHECKEDIN = 'checkedIn',
  SERVING = 'serving',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface CDateRange {
  from: Date;
  to: Date;
}
