import type { ObjectId } from 'mongoose';
import type { User } from './user';
import type { ConsultationPackage } from './consultationPackage';

export interface Schedule {
  _id?: ObjectId;
  userId: ObjectId | User;
  weekPeriod: CDateRange;
  dayOffset: number;
  timeOffset: number;
  status: ScheduleStatus;
  packageId: ObjectId | ConsultationPackage;
}

export enum ScheduleStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CHECKEDIN = 'checkedin',
}

export interface CDateRange {
  from: Date;
  to: Date;
}
