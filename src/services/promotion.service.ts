import type { Promotion } from '../types/promotion';
import { type PromotionRepository, PromotionRepositoryImpl } from '../repositories/promotion';
import type { ObjectId } from 'mongoose';
import type { MongooseFindManyOptions } from '../repositories/type';

export class PromotionService {
  private promotionRepository: PromotionRepository;

  constructor() {
    this.promotionRepository = new PromotionRepositoryImpl();
  }

  async create(promotion: Omit<Promotion, '_id'>): Promise<Promotion | null> {
    return await this.promotionRepository.create(promotion);
  }

  async createMany(promotions: Omit<Promotion, '_id'>[]): Promise<Promotion[]> {
    try {
      const createdPromotions = await this.promotionRepository.createMany(promotions as any);
      if (!createdPromotions) {
        throw new Error('Failed to create promotions');
      }
      return createdPromotions;
    } catch (error) {
      throw error;
    }
  }

  async findById(id: ObjectId): Promise<Promotion | null> {
    return await this.promotionRepository.findById(id);
  }

  async findAll(): Promise<Promotion[]> {
    return await this.promotionRepository.findAll();
  }

  async findMany(options?: MongooseFindManyOptions): Promise<Promotion[]> {
    return await this.promotionRepository.findMany(options);
  }

  async update(id: ObjectId, promotion: Partial<Promotion>): Promise<Promotion | null> {
    return await this.promotionRepository.update(id, promotion, { new: true });
  }

  async delete(id: ObjectId): Promise<Promotion | null> {
    return await this.promotionRepository.delete(id);
  }

  async findActive(): Promise<Promotion[]> {
    const now = new Date();
    return await this.promotionRepository.findMany({
      filter: {
        validFrom: { $lte: now },
        validTo: { $gte: now },
      },
    });
  }
}
