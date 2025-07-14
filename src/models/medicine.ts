import { model, Schema } from 'mongoose';
import type { Medicine } from '../../../clinical/types/medication';

const DOCUMENT = 'Medicine';
const COLLECTION = 'Medicines';

const medicineSchema = new Schema<Medicine>(
  {
    name: {
      type: String,
      required: true,
    },
    dosage: {
      type: String,
      required: true,
    },
    form: {
      type: String,
      required: true,
    },
    route: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default model<Medicine>(DOCUMENT, medicineSchema, COLLECTION);
