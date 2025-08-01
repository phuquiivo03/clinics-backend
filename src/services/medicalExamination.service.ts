import type { MedicalExaminationResult } from '../types/medicalExamination';
import { ErrorCode } from '../pkg/e/code';
import {
  MedicalExaminationResultRepositoryImpl,
  type MedicalExaminationResultRepository,
} from '../repositories/medicalExamination';
import type { ObjectId } from 'mongoose';
import type { MongooseFindManyOptions } from '../repositories/type';
import type { AppResponse } from '../dto/response';

class MedicalExaminationResultService {
  readonly repository: MedicalExaminationResultRepository;

  constructor() {
    this.repository = new MedicalExaminationResultRepositoryImpl();
  }

  async create(data: Partial<MedicalExaminationResult>): Promise<MedicalExaminationResult> {
    try {
      const result = await this.repository.create(data);
      if (!result) {
        throw new Error('Invalid medical examination data');
      }
      return result;
    } catch (error) {
      throw error;
    }
  }

  async findMany(
    options: MongooseFindManyOptions,
  ): Promise<AppResponse<MedicalExaminationResult[]>> {
    try {
      return await this.repository.findMany(options);
    } catch (error) {
      throw error;
    }
  }

  async findById(id: string): Promise<MedicalExaminationResult> {
    try {
      const result = await this.repository.findById(id as unknown as ObjectId);
      if (!result) {
        throw new Error('Medical examination result not found');
      }
      return result;
    } catch (error) {
      throw error;
    }
  }

  async findByPatientId(
    patientId: string,
  ): Promise<AppResponse<MedicalExaminationResult[]>> {
    try {
      return await this.repository.findByPatientId(patientId as unknown as ObjectId);
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: string,
    data: Partial<MedicalExaminationResult>,
  ): Promise<MedicalExaminationResult> {
    try {
      const result = await this.repository.findById(id as unknown as ObjectId);
      if (!result) {
        throw new Error('Medical examination result not found');
      }
      const updatedResult = await this.repository.update(id as unknown as ObjectId, data, {
        new: true,
      });
      if (!updatedResult) {
        throw new Error('Failed to update medical examination result');
      }
      return updatedResult;
    } catch (error) {
      throw error;
    }
  }

  async delete(id: string): Promise<MedicalExaminationResult | null> {
    try {
      const result = await this.repository.findById(id as unknown as ObjectId);
      if (!result) {
        throw new Error('Medical examination result not found');
      }
      return await this.repository.delete(id as unknown as ObjectId);
    } catch (error) {
      throw error;
    }
  }
}

export { MedicalExaminationResultService };
