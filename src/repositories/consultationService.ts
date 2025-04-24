import type { ObjectId } from 'mongoose';
import { consultationServiceModel } from '../models';
import type { ConsultationService } from '../types';
import { BaseRepositoryImpl, type BaseRepository } from './base';

interface ConsultationServiceRepository extends BaseRepository<ConsultationService> {
  updateMany(ids: ObjectId[], data: Partial<ConsultationService>): Promise<ConsultationService[]>;
}

class ConsultationServiceRepositoryImpl
  extends BaseRepositoryImpl<ConsultationService>
  implements ConsultationServiceRepository
{
  constructor() {
    super(consultationServiceModel);
  }

  async updateMany(
    ids: ObjectId[],
    data: Partial<ConsultationService>,
  ): Promise<ConsultationService[]> {
    try {
      await this.model.updateMany({ _id: { $in: ids } }, data).exec();
      return await this.model.find({ _id: { $in: ids } }).exec();
    } catch (error) {
      throw error;
    }
  }
}

export { type ConsultationServiceRepository, ConsultationServiceRepositoryImpl };
