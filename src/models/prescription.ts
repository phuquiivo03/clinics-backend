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
        type: Schema.Types.Mixed,
        required: true,
        validate: {
          validator: function(v: any) {
            // Either an ObjectId or a Medication object with required fields
            return mongoose.Types.ObjectId.isValid(v) || 
              (v.medicine && v.quantity && v.frequency && v.duration);
          },
          message: 'Medications must be valid ObjectIds or Medication objects'
        }
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
