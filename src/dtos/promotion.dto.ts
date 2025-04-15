import { PROMOTION_DISCOUNT } from '../types/promotion';

export class CreatePromotionDto {
  title!: string;
  description!: string;
  image!: string;
  condition!: string;
  regulation!: string;
  discountType!: PROMOTION_DISCOUNT;
  discountValue!: string | number;
  validFrom!: Date;
  validTo!: Date;
}

export class UpdatePromotionDto {
  title?: string;
  description?: string;
  image?: string;
  condition?: string;
  regulation?: string;
  discountType?: PROMOTION_DISCOUNT;
  discountValue?: string | number;
  validFrom?: Date;
  validTo?: Date;
}
