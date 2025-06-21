import { model, Schema } from 'mongoose';
import {
  ScheduleStatus,
  type Schedule,
  type CDateRange,
  ScheduleServiceStatus,
} from '../types/schedules';

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
    type: {
      type: String,
      enum: ['package', 'services'],
      required: true,
    },
    timeOffset: {
      type: Number,
      enum: [0, 1], // 0 for morning, 1 for afternoon
      required: true,
    },
    status: {
      type: String,
      enum: ScheduleStatus,
      required: true,
    },
    services: [
      {
        service: {
          type: Schema.Types.ObjectId,
          ref: 'ConsultationService',
          required: true,
        },
        status: {
          type: String,
          enum: ScheduleServiceStatus,
          default: 'pending',
        },
      },
    ],

    packageInfo: {
      type: Schema.Types.ObjectId,
      ref: 'ConsultationPackage',
    },
  },
  {
    timestamps: true,
  },
);

export default model<Schedule>(DOCUMENT, scheduleSchema, COLLECTION);
