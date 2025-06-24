import { prescriptionModel } from '../models';
import type { Prescription } from '../types';
import { BaseRepositoryImpl, type BaseRepository } from './base';

interface PrescriptionRepository extends BaseRepository<Prescription> {}

class PrescriptionRepositoryImpl
  extends BaseRepositoryImpl<Prescription>
  implements PrescriptionRepository
{
  constructor() {
    super(prescriptionModel);
  }
}

export { type PrescriptionRepository, PrescriptionRepositoryImpl };
