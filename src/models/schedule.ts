import { model, Schema } from 'mongoose';
import type { Schedule } from '../types/schedules';

const DOCUMENT = 'Schedule';
const COLLECTION = 'Schedules';

const scheduleSchema = new Schema<Schedule>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    status: {
      type: String,
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
