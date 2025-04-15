import { Schema, model } from 'mongoose';
import type { Promotion } from '../types/promotion';
import { PROMOTION_DISCOUNT } from '../types/promotion';

const promotionSchema = new Schema<Promotion>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    condition: { type: String, required: true },
    regulation: { type: String, required: true },
    discountType: {
      type: String,
      required: true,
      enum: Object.values(PROMOTION_DISCOUNT),
    },
    discountValue: { type: Schema.Types.Mixed, required: true },
    validFrom: { type: Date, required: true },
    validTo: { type: Date, required: true },
  },
  {
    timestamps: true,
  },
);

export const PromotionSchema = promotionSchema;
