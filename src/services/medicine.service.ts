import type { ObjectId } from 'mongoose';
import { MedicineRepositoryImpl } from '../repositories/medicine';
import type { Medicine } from '../types/medication';

class MedicineService {
  private medicineRepository: MedicineRepositoryImpl;

  constructor() {
    this.medicineRepository = new MedicineRepositoryImpl();
  }

  async create(data: Partial<Medicine>): Promise<Medicine | null> {
    return this.medicineRepository.create(data);
  }

  async getById(id: ObjectId): Promise<Medicine | null> {
    return this.medicineRepository.findById(id);
  }

  async getAll(options?: any): Promise<any> {
    return this.medicineRepository.findAll(options);
  }

  async update(id: ObjectId, data: Partial<Medicine>): Promise<Medicine | null> {
    return this.medicineRepository.update(id, data);
  }

  async delete(id: ObjectId): Promise<Medicine | null> {
    return this.medicineRepository.delete(id);
  }
}

export default new MedicineService();
