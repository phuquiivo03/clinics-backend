import { model, Schema } from 'mongoose';
import type { DayPackage } from '../types/dayPackage';

const DOCUMENT = 'DayPackage';
const COLLECTION = 'DayPackages';

const dayPackageSchema = new Schema<DayPackage>({
  dayOffset: {
    type: Number,
    required: true,
  },
  periodPkgs: [
    {
      type: Schema.Types.ObjectId,
      ref: 'PeriodPackage',
    },
  ],
});

export default model<DayPackage>(DOCUMENT, dayPackageSchema, COLLECTION);
