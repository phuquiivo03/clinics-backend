import { model, Schema } from 'mongoose';
import type { ConsultationPackage } from '../types';

const DOCUMENT = 'ConsultationPackage';
const COLLECTION = 'ConsultationPackages';
const consultationPackageSchema = new Schema<ConsultationPackage>(
  {
    category: {
      type: String,
      required: true,
    },
    titleImage: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    tests: [
      {
        type: Schema.Types.ObjectId,
        ref: 'ConsultationService',
      },
    ],
    condition: {
      type: String,
      required: true,
    },
    maxSlotPerPeriod: {
      type: Number,
      required: true,
    },
    faq: [
      {
        question: {
          type: String,
          required: true,
        },
        answer: {
          type: String,
          required: true,
        },
      },
    ],
    bookingOption: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default model<ConsultationPackage>(DOCUMENT, consultationPackageSchema, COLLECTION);
