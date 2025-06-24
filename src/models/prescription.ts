import mongoose, { Document, model, Schema } from 'mongoose';
import type { Prescription } from '../types';

const DOCUMENT = 'Prescription';
const COLLECTION = 'Prescriptions';
const prescriptionSchema = new Schema<Prescription>(
  {
    dateIssued: {
      type: String,
      required: true,
    },
    doctor: {
      type: Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    patient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    diagnosis: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
    },
    medications: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Medication',
        required: true,
      },
    ],
    totalCost: {
      type: Number,
      required: true,
      min: 0,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export default model<Prescription>(DOCUMENT, prescriptionSchema, COLLECTION);
