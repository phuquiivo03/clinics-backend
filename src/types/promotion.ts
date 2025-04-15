export interface Promotion {
  _id: string;
  title: string;
  description: string;
  image: string;
  condition: string;
  regulation: string;
  discountType: PROMOTION_DISCOUNT;
  discountValue: string | number;
  validFrom: Date;
  validTo: Date;
  createdAt: Date;
}

export enum PROMOTION_DISCOUNT {
  FREE = 'Miễn phí',
  PERCENTAGE = 'percentage',
  PRICE = 'price',
}
