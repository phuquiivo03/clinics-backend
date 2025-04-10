import { model, Schema } from 'mongoose';
import type { OTP } from '../types';

const DOCUMENT = 'OTP';
const COLLECTION = 'OTPs';

const otpSchema = new Schema<OTP>({
  code: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  createAt: {
    type: Date,
    default: Date.now,
    expires: 60,
  },
});

export default model<OTP>(DOCUMENT, otpSchema, COLLECTION);
