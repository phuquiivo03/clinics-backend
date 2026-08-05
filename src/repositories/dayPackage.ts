import { dayPackageModel } from '../models';
import type { DayPackage } from '../types/dayPackage';
import { BaseRepositoryImpl, type BaseRepository } from './base';
import type { ObjectId } from 'mongoose';

interface DayPackageRepository extends BaseRepository<DayPackage> {
  findByDayPkgId(dayPkgId: ObjectId): Promise<DayPackage | null>;
}

class DayPackageRepositoryImpl
  extends BaseRepositoryImpl<DayPackage>
  implements DayPackageRepository
{
  constructor() {
    super(dayPackageModel);
  }

  async findByDayPkgId(dayPkgId: ObjectId): Promise<DayPackage | null> {
    try {
      return this.model.findOne({ day_pkg_id: dayPkgId }).populate('periodPkgs').exec();
    } catch (error) {
      throw error;
    }
  }
}

export { type DayPackageRepository, DayPackageRepositoryImpl };
export default new DayPackageRepositoryImpl();
