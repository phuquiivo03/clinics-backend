import { Schema } from 'mongoose';
import type { Payment } from '../types/payment';
import { PaymentMethod, PaymentStatus } from '../types/payment';

const paymentSchema = new Schema<Payment>(
  {
    schedule: { type: Schema.Types.ObjectId, ref: 'Schedule', required: true },
    service: { type: Schema.Types.ObjectId, ref: 'ConsultationService', required: true },
    method: {
      type: String,
      required: true,
      enum: Object.values(PaymentMethod),
      default: PaymentMethod.UNKNOWN,
    },
    amount: { type: Number, required: true },
    status: {
      type: String,
      required: true,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },
    note: { type: String },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    paymentId: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export const PaymentSchema = paymentSchema; 