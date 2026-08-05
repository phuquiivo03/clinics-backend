import {
  type ConsultationServiceRepository,
  ConsultationServiceRepositoryImpl,
} from '../repositories';
import type { MongooseFindManyOptions, MongooseFindOneOptions } from '../repositories/type';
import type { ConsultationService } from '../types';
import type { ObjectId } from 'mongoose';
import type { Pagination } from '../types/response';
import type { AppResponse } from '../dto/response';

class ConsultationServiceService {
  readonly consultationServiceRepository: ConsultationServiceRepository;

  constructor() {
    this.consultationServiceRepository = new ConsultationServiceRepositoryImpl();
  }

  async create(data: Partial<ConsultationService>): Promise<ConsultationService> {
    try {
      const createdService = await this.consultationServiceRepository.create(data);
      if (createdService) {
        return createdService;
      }
      throw new Error('Invalid service data');
    } catch (error) {
      throw error;
    }
  }

  async createMany(data: Partial<ConsultationService[]>): Promise<ConsultationService[]> {
    try {
      const createdServices = await this.consultationServiceRepository.createMany(data);
      if (createdServices) {
        return createdServices;
      }
      throw new Error('Invalid service data');
    } catch (error) {
      throw error;
    }
  }

  async findById(
    id: ObjectId,
    options?: MongooseFindOneOptions,
  ): Promise<ConsultationService | null> {
    try {
      return this.consultationServiceRepository.findById(id, options);
    } catch (error) {
      throw error;
    }
  }

  async findAll(options?: MongooseFindManyOptions): Promise<AppResponse<ConsultationService[]>> {
    try {
      return this.consultationServiceRepository.findAll(options);
    } catch (error) {
      throw error;
    }
  }

  async findMany(options?: MongooseFindManyOptions): Promise<AppResponse<ConsultationService[]>> {
    try {
      return this.consultationServiceRepository.findMany(options);
    } catch (error) {
      throw error;
    }
  }

  async updateMany(
    ids: ObjectId[],
    data: Partial<ConsultationService>,
  ): Promise<ConsultationService[]> {
    try {
      return this.consultationServiceRepository.updateMany(ids, data);
    } catch (error) {
      throw error;
    }
  }
}

const consultationServiceService = new ConsultationServiceService();

export default consultationServiceService;
