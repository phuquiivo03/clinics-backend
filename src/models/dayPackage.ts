import { model, Schema } from 'mongoose';
import type { DayPackage } from '../types/dayPackage';

const DOCUMENT = "DayPackage";
const COLLECTION = "DayPackages";

const dayPackageSchema = new Schema<DayPackage>(
  {
    day_offset: {
      type: Number,
      required: true,
    },
    period_pkgs: [{
      type: Schema.Types.ObjectId,
      ref: 'PeriodPackage',
    }]
  }
);

export default model<DayPackage>(DOCUMENT, dayPackageSchema, COLLECTION); 