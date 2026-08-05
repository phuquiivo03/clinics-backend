import type { ObjectId } from 'mongoose';
import type { Specialty } from '../types';
import { type SpecialtyRepository, SpecialtyRepositoryImpl } from '../repositories';
import type { MongooseFindManyOptions, MongooseFindOneOptions } from '../repositories/type';
import type { AppResponse } from '../dto/response';

class SpecialtyService {
  readonly specialtyRepository: SpecialtyRepository;

  constructor() {
    this.specialtyRepository = new SpecialtyRepositoryImpl();
  }

  async create(data: Specialty): Promise<Specialty | null> {
    try {
      // Check if specialty with same name already exists
      const specialtyExists = await this.specialtyRepository.findOne({
        filter: { name: data.name },
      });

      if (specialtyExists) {
        throw new Error('Specialty with this name already exists');
      }

      return this.specialtyRepository.create(data);
    } catch (error) {
      throw error;
    }
  }

  async createMany(data: Partial<Specialty[]>): Promise<Specialty[] | null> {
    try {
      const specialties = await this.specialtyRepository.createMany(data);
      if (specialties) {
        return specialties;
      }
      throw new Error('Invalid specialty data');
    } catch (error) {
      throw error;
    }
  }

  async findById(id: ObjectId): Promise<Specialty | null> {
    try {
      return this.specialtyRepository.findById(id);
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<AppResponse<Specialty[]>> {
    try {
      return this.specialtyRepository.findAll();
    } catch (error) {
      throw error;
    }
  }

  async update(id: ObjectId, data: Partial<Specialty>): Promise<Specialty | null> {
    try {
      // Check if specialty exists
      const specialty = await this.specialtyRepository.findById(id);
      if (!specialty) {
        throw new Error('Specialty not found');
      }

      // If name is being updated, check if new name already exists
      if (data.name && data.name !== specialty.name) {
        const specialtyWithNewName = await this.specialtyRepository.findOne({
          filter: { name: data.name },
        });
        if (specialtyWithNewName) {
          throw new Error('Specialty with this name already exists');
        }
      }

      return this.specialtyRepository.update(id, data, { new: true });
    } catch (error) {
      throw error;
    }
  }

  async delete(id: ObjectId): Promise<Specialty | null> {
    try {
      // Check if specialty exists
      const specialty = await this.specialtyRepository.findById(id);
      if (!specialty) {
        throw new Error('Specialty not found');
      }

      return this.specialtyRepository.delete(id);
    } catch (error) {
      throw error;
    }
  }

  async findOne(options: MongooseFindOneOptions): Promise<Specialty | null> {
    try {
      return this.specialtyRepository.findOne(options);
    } catch (error) {
      throw error;
    }
  }

  async findMany(options: MongooseFindManyOptions): Promise<AppResponse<Specialty[]>> {
    try {
      return this.specialtyRepository.findMany(options);
    } catch (error) {
      throw error;
    }
  }
}

const specialtyService = new SpecialtyService();
export default specialtyService;
