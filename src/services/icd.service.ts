import type { ObjectId } from 'mongoose';
import { ICDRepositoryImpl } from '../repositories/icd';
import type { ICD } from '../types/icd';

class ICDService {
  private icdRepository: ICDRepositoryImpl;

  constructor() {
    this.icdRepository = new ICDRepositoryImpl();
  }

  async create(data: Partial<ICD>): Promise<ICD | null> {
    return this.icdRepository.create(data);
  }

  async createMany(data: Partial<ICD>[]): Promise<ICD[] | null> {
    return this.icdRepository.createMany(data as any);
  }

  async getById(id: ObjectId): Promise<ICD | null> {
    return this.icdRepository.findById(id);
  }

  async getAll(options?: any): Promise<any> {
    return this.icdRepository.findAll(options);
  }

  async update(id: ObjectId, data: Partial<ICD>): Promise<ICD | null> {
    return this.icdRepository.update(id, data);
  }

  async delete(id: ObjectId): Promise<ICD | null> {
    return this.icdRepository.delete(id);
  }

  async searchByCodeOrTitle(query: string, options?: any): Promise<any> {
    const queryString = query.toLowerCase().trim().replaceAll("\"", '');
    const searchFilter = {
      $or: [
        { code: { $regex: queryString, $options: 'i' } },
        { title: { $regex: queryString, $options: 'i' } },
        { range: { $regex: queryString, $options: 'i' } },
      ],
    };

    const searchOptions = {
      ...options,
      filter: searchFilter,
    };

    return this.icdRepository.findAll(searchOptions);
  }

  async getByCode(code: string): Promise<ICD | null> {
    return this.icdRepository.findOne({
      filter: { code },
    });
  }
}

export default new ICDService();