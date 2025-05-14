import { model, Schema } from 'mongoose';
import { ScheduleStatus, type Schedule, type CDateRange } from '../types/schedules';

const DOCUMENT = 'Schedule';
const COLLECTION = 'Schedules';

const DateRangeSchema = new Schema<CDateRange>({
  from: {
    type: Date,
    required: true,
  },
  to: {
    type: Date,
    required: true,
  },
});
const scheduleSchema = new Schema<Schedule>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    weekPeriod: {
      type: DateRangeSchema,
      required: true,
    },
    dayOffset: {
      type: Number,
      required: true,
    },
    timeOffset: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ScheduleStatus,
      required: true,
    },

    packageId: {
      type: Schema.Types.ObjectId,
      ref: 'ConsultationPackage',
    },
  },
  {
    timestamps: true,
  },
);

export default model<Schedule>(DOCUMENT, scheduleSchema, COLLECTION);
