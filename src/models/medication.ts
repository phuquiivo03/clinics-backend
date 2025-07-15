import { model, Schema } from 'mongoose';
import type { Medication } from '../../../clinical/src/types/medication';

const DOCUMENT = 'Medication';
const COLLECTION = 'Medications';

const medicationSchema = new Schema<Medication>(
  {
    medicine: {
      type: Schema.Types.ObjectId,
      ref: 'Medicine',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    frequency: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    instruction: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export default model<Medication>(DOCUMENT, medicationSchema, COLLECTION);
