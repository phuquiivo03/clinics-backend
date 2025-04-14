import type { ObjectId } from 'mongoose';
import type { ConsultationPackage } from './consultationPackage';

export interface PeriodPackage {
  _id?: ObjectId;
  startTime: Date;
  endTime: Date;
  pkg: ObjectId | ConsultationPackage;
  booked: number;
  maxBook: number;
}
