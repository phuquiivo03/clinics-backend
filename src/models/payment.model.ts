import { model } from 'mongoose';
import { PaymentSchema } from '../schemas/payment.schema';
import type { Payment } from '../types/payment';

export const PaymentModel = model<Payment>('Payment', PaymentSchema);
