import type { Medication, Medicine } from '../types';
import { BaseRepositoryImpl, type BaseRepository } from './base';
import { medicineModel } from '../models';

interface MedicineRepository extends BaseRepository<Medicine> {}

class MedicineRepositoryImpl extends BaseRepositoryImpl<Medicine> implements MedicineRepository {
  constructor() {
    super(medicineModel);
  }
}

export { type MedicineRepository, MedicineRepositoryImpl };
