import type { AppResponse } from '../dto/response';
import { DoctorRepositoryImpl, type DoctorRepository } from '../repositories';
import type { MongooseFindManyOptions, MongooseFindOneOptions } from '../repositories/type';
import type { Doctor } from '../types';

class DoctorService {
  readonly doctorRepository: DoctorRepository;
  constructor() {
    this.doctorRepository = new DoctorRepositoryImpl();
  }

  async create(data: Partial<Doctor>): Promise<Doctor> {
    console.log(data);
    try {
      const createdDoctor = this.doctorRepository.create(data);
      if (!createdDoctor || createdDoctor == null) {
        throw new Error('Invalid doctor data');
      }
      // @ts-ignore
      return createdDoctor;
    } catch (error) {
      throw error;
    }
  }

  async findAll(options?: MongooseFindManyOptions): Promise<AppResponse<Doctor[]>> {
    try {
      return this.doctorRepository.findAll(options);
    } catch (error) {
      throw error;
    }
  }

  async findOne(options: MongooseFindOneOptions): Promise<Doctor | null> {
    try {
      return this.doctorRepository.findOne(options);
    } catch (error) {
      throw error;
    }
  }

  async findMany(options: MongooseFindManyOptions): Promise<AppResponse<Doctor[]>> {
    try {
      return this.doctorRepository.findMany(options);
    } catch (error) {
      throw error;
    }
  }

  async aggregate(pipeline: any[], options?: MongooseFindManyOptions): Promise<any[]> {
    try {
      return this.doctorRepository.aggregate(pipeline, options);
    } catch (error) {
      throw error;
    }
  }
}

const doctorService = new DoctorService();

export default doctorService;
