import { model, Schema } from 'mongoose';
import type { ICD } from '../types/icd';

const DOCUMENT = 'ICD';
const COLLECTION = 'ICDs';

const icdSchema = new Schema<ICD>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    range: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

// Create indexes for better query performance

export default model<ICD>(DOCUMENT, icdSchema, COLLECTION);