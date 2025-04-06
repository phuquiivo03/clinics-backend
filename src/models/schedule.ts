import { model, Schema } from 'mongoose';
import type { Schedule } from '../types/schedules';

const DOCUMENT = "Schedule";
const COLLECTION = "Schedules";

const scheduleSchema = new Schema<Schedule>(
  {
    doctor_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    room_id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    service_id: {
      type: Schema.Types.ObjectId,
      ref: 'ConsultationService',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    start_time: {
      type: String,
      required: true,
    },
    end_time: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    package_id: {
      type: Schema.Types.ObjectId,
      ref: 'ConsultationPackage',
    },
  },
  {
    timestamps: true,
  }
);

export default model<Schedule>(DOCUMENT, scheduleSchema, COLLECTION);
