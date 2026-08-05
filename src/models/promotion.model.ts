import { model } from 'mongoose';
import { PromotionSchema } from '../schemas/promotion.schema';
import type { Promotion } from '../types/promotion';

export const PromotionModel = model<Promotion>('Promotion', PromotionSchema);
