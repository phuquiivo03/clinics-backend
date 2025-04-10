import { model, Schema } from 'mongoose';
import type { PeriodPackage } from '../types/periodPackage';

const DOCUMENT = 'PeriodPackage';
const COLLECTION = 'PeriodPackages';

const periodPackageSchema = new Schema<PeriodPackage>(
  {
    pkg: {
      type: Schema.Types.ObjectId,
      ref: 'ConsultationPackage',
      required: true,
    },
    booked: {
      type: Number,
      default: 0,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
  },

  {
    timestamps: true,
  },
);

export default model<PeriodPackage>(DOCUMENT, periodPackageSchema, COLLECTION);
