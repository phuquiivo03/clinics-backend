import { model, Schema } from 'mongoose';
import type { ConsultationPackage } from '../types';

const DOCUMENT = 'ConsultationPackage';
const COLLECTION = 'ConsultationPackages';
const consultationPackageSchema = new Schema<ConsultationPackage>(
  {
    title: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    features: [
      {
        type: String,
        required: true,
      },
    ],
    priceOptions: [
      {
        tier: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        testsIncluded: {
          type: Number,
          required: true,
        },
      },
    ],
    tests: [
      {
        type: Schema.Types.ObjectId,
        ref: 'ConsultationService',
      },
    ],
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
    bookingOptions: [
      {
        type: {
          type: String,
          enum: ['Branch', 'Home Sample Collection'],
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        actionUrl: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

export default model<ConsultationPackage>(DOCUMENT, consultationPackageSchema, COLLECTION);
