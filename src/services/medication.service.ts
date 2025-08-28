import type { ObjectId } from 'mongoose';
import { MedicationRepositoryImpl } from '../repositories/medication';
import type { Medication } from '../types/medication';

class MedicationService {
  private medicationRepository: MedicationRepositoryImpl;

  constructor() {
    this.medicationRepository = new MedicationRepositoryImpl();
  }

  async create(data: Partial<Medication>): Promise<Medication | null> {
    return this.medicationRepository.create(data);
  }

  async getById(id: ObjectId): Promise<Medication | null> {
    return this.medicationRepository.findById(id, {
      populateOptions: [
        {
          path: 'medicine',
          select: 'name dosage form route',
        },
      ] as any,
    });
  }

  async getAll(options?: any): Promise<any> {
    return this.medicationRepository.findAll({
      ...options,
      populateOptions: [
        {
          path: 'medicine',
          select: 'name dosage form route',
        },
      ] as any,
    });
  }

  async update(id: ObjectId, data: Partial<Medication>): Promise<Medication | null> {
    return this.medicationRepository.update(id, data);
  }

  async delete(id: ObjectId): Promise<Medication | null> {
    return this.medicationRepository.delete(id);
  }
}

export default new MedicationService();
