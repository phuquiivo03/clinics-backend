import { model, Schema } from 'mongoose';
import type { PackageWeek as PackageWeek } from '../types/packageWeek';

const DOCUMENT = 'PackageWeek';
const COLLECTION = 'PackageWeeks';

const packageWeekSchema = new Schema<PackageWeek>(
  {
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    packageDays: [
      {
        type: Schema.Types.ObjectId,
        ref: 'DayPackage',
      },
    ],
  },
  {
    timestamps: true,
  },
);

export default model<PackageWeek>(DOCUMENT, packageWeekSchema, COLLECTION);
