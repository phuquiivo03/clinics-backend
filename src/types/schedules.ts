import type { ObjectId } from 'mongoose';
import type { User } from './user';
import type { ConsultationPackage } from './consultationPackage';
import type { ConsultationService } from './consultationService';

export interface Schedule {
  _id?: ObjectId;
  userId: ObjectId | User;
  weekPeriod: CDateRange;
  dayOffset: number;
  timeOffset: 0 | 1; // 0 for morning, 1 for afternoon
  status: ScheduleStatus;
  type: 'package' | 'services';
  packageInfo: ObjectId | ConsultationPackage;
  services: ScheduleService[];
}

export interface ScheduleService {
  service: ObjectId | ConsultationService;
  status: ScheduleServiceStatus;
}

export enum ScheduleServiceStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
}

export enum ScheduleStatus {
  CONFIRMED = 'pending',
  CHECKEDIN = 'checkedIn',
  SERVING = 'serving',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface CDateRange {
  from: Date;
  to: Date;
}
