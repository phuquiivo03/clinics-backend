import type { ObjectId } from 'mongoose';
import type { PeriodPackage } from './periodPackage';

export interface DayPackage {
  dayOffset: number;
  periodPkgs: ObjectId[] | PeriodPackage[];
}
