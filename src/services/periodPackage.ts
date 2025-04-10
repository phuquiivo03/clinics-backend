import { type ObjectId } from 'mongoose';
import periodPackageRepository from '../repositories/periodPackage';
import type { PeriodPackage } from '../types/periodPackage';
import type { MongooseFindOneOptions } from '../repositories/type';

class PeriodPackageService {
  async create(data: Partial<PeriodPackage>): Promise<PeriodPackage | null> {
    try {
      const periodPackage = await periodPackageRepository.create(data);
      if (periodPackage) {
        return periodPackage;
      }
      throw new Error('Invalid period package data');
    } catch (error) {
      throw error;
    }
  }

  async findById(id: ObjectId, options?: MongooseFindOneOptions): Promise<PeriodPackage | null> {
    try {
      return periodPackageRepository.findById(id, options);
    } catch (error) {
      throw error;
    }
  }

  async update(id: ObjectId, data: Partial<PeriodPackage>): Promise<PeriodPackage | null> {
    try {
      return periodPackageRepository.update(id, data, { new: true });
    } catch (error) {
      throw error;
    }
  }

  async delete(id: ObjectId): Promise<PeriodPackage | null> {
    try {
      return periodPackageRepository.delete(id);
    } catch (error) {
      throw error;
    }
  }

  async incrementBooked(id: ObjectId): Promise<PeriodPackage | null> {
    try {
      const periodPackage = await periodPackageRepository.findById(id);
      if (!periodPackage) {
        throw new Error('Period package not found');
      }

      return periodPackageRepository.update(
        id,
        { booked: periodPackage.booked + 1 },
        { new: true },
      );
    } catch (error) {
      throw error;
    }
  }
}

const periodPackageService = new PeriodPackageService();
export default periodPackageService;
