import { type ObjectId } from 'mongoose';
import dayPackageRepository from '../repositories/dayPackage';
import type { DayPackage } from '../types/dayPackage';
import periodPackageService from './periodPackage.service';
import type { MongooseFindOneOptions } from '../repositories/type';

class DayPackageService {
  async create(data: Partial<DayPackage>): Promise<DayPackage | null> {
    try {
      const dayPackage = await dayPackageRepository.create(data);
      if (dayPackage) {
        return dayPackage;
      }
      throw new Error('Invalid day package data');
    } catch (error) {
      throw error;
    }
  }

  async findById(id: ObjectId, options?: MongooseFindOneOptions): Promise<DayPackage | null> {
    try {
      return dayPackageRepository.findById(id, options);
    } catch (error) {
      throw error;
    }
  }

  async findByDayPkgId(dayPkgId: ObjectId): Promise<DayPackage | null> {
    try {
      return dayPackageRepository.findByDayPkgId(dayPkgId);
    } catch (error) {
      throw error;
    }
  }

  async update(id: ObjectId, data: Partial<DayPackage>): Promise<DayPackage | null> {
    try {
      return dayPackageRepository.update(id, data, { new: true });
    } catch (error) {
      throw error;
    }
  }

  async delete(id: ObjectId): Promise<DayPackage | null> {
    try {
      return dayPackageRepository.delete(id);
    } catch (error) {
      throw error;
    }
  }

  async addPeriodPackage(id: ObjectId, periodPackageId: ObjectId): Promise<DayPackage | null> {
    try {
      const dayPackage = await dayPackageRepository.findById(id);
      if (!dayPackage) {
        throw new Error('Day package not found');
      }

      // Check if the period package exists
      const periodPackage = await periodPackageService.findById(periodPackageId);
      if (!periodPackage) {
        throw new Error('Period package not found');
      }

      // Add period package to day package
      const periodPkgs = [...(dayPackage.periodPkgs as ObjectId[]), periodPackageId];
      return dayPackageRepository.update(id, { periodPkgs: periodPkgs }, { new: true });
    } catch (error) {
      throw error;
    }
  }
}

const dayPackageService = new DayPackageService();
export default dayPackageService;
