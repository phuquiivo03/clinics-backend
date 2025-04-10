import {
  type ConsultationServiceRepository,
  ConsultationServiceRepositoryImpl,
} from '../repositories';
import type { ConsultationService } from '../types';
import type { ObjectId } from 'mongoose';

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

  async findById(id: ObjectId): Promise<ConsultationService | null> {
    try {
      return this.consultationServiceRepository.findById(id);
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<ConsultationService[]> {
    try {
      return this.consultationServiceRepository.findAll();
    } catch (error) {
      throw error;
    }
  }
}

const consultationServiceService = new ConsultationServiceService();

export default consultationServiceService;
