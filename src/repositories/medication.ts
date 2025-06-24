
import type { Medication } from '../types';
import { BaseRepositoryImpl, type BaseRepository } from './base';
import { medicationModel } from '../models';

interface MedicationRepository extends BaseRepository<Medication> {}

class MedicationRepositoryImpl extends BaseRepositoryImpl<Medication> implements MedicationRepository {
  constructor() {
    super(medicationModel);
  }
}

export { type MedicationRepository, MedicationRepositoryImpl };
