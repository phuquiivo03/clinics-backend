import { Schema } from 'mongoose';
import type { Payment } from '../types/payment';
import { PaymentMethod, PaymentStatus } from '../types/payment';
import { z } from 'zod';

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
    paymentId: { type: String, required: false },
  },
  {
    timestamps: true,
  },
);

export const updatePaymentSchema = z.object({
  status: z.nativeEnum(PaymentStatus).optional(),
  amount: z.number().optional(),
  method: z.nativeEnum(PaymentMethod).optional(),
});

export const vnpayCreateSchema = z.object({
  orderId: z.string().optional(),
  orderInfo: z.string().default('Thanh toan don hang'),
  paymentIds: z.array(z.string().min(1, 'Payment ID cannot be empty')).min(1, 'At least one payment ID is required'),
});

export const PaymentSchema = paymentSchema;
