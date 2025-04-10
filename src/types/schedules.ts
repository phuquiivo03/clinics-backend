import type { ObjectId } from 'mongoose';
import type { User } from './user';
import type { ConsultationPackage } from './consultationPackage';

export interface Schedule {
  id?: ObjectId;
  userId: ObjectId | User;
  date: Date;
  startTime: string;
  endTime: string;
  status: string;
  packageId?: ObjectId | ConsultationPackage;
}
