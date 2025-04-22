import { model, Schema } from 'mongoose';
import type { Specialty } from '../types';

const DOCUMENT = 'Specialty';
const COLLECTION = 'Specialties';

const specialtySchema = new Schema<Specialty>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default model<Specialty>(DOCUMENT, specialtySchema, COLLECTION);
