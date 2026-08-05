import type { ObjectId } from 'mongoose';
import type { DayPackage } from './dayPackage';

export interface PackageWeek {
  _id?: ObjectId;
  startDate: Date;
  endDate: Date;
  packageDays: DayPackage[];
}
