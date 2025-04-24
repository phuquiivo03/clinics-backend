import { model, Schema } from 'mongoose';
import type { ConsultationService } from '../types';

const DOCUMENT = 'ConsultationService';
const COLLECTION = 'ConsultationServices';

const consultationServiceSchema = new Schema<ConsultationService>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    room: {
      type: Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
    doctor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    specialization: {
      type: Schema.Types.ObjectId,
      ref: 'Specialty',
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

export default model<ConsultationService>(DOCUMENT, consultationServiceSchema, COLLECTION);
