import type { Promotion } from '../types/promotion';
import { BaseRepositoryImpl, type BaseRepository } from './base';
import { PromotionModel } from '../models/promotion.model';

interface PromotionRepository extends BaseRepository<Promotion> {}

class PromotionRepositoryImpl extends BaseRepositoryImpl<Promotion> implements PromotionRepository {
  constructor() {
    super(PromotionModel);
  }
}

export { PromotionRepositoryImpl, type PromotionRepository };
