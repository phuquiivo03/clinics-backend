import type { MedicalExaminationResult } from '../types/medicalExamination';
import { BaseRepositoryImpl, type BaseRepository } from './base';
import { MedicalExaminationResultModel } from '../models';
import type { ObjectId } from 'mongoose';
import type { MongooseFindManyOptions } from './type';

interface MedicalExaminationResultRepository extends BaseRepository<MedicalExaminationResult> {
  findByPatientId(
    patientId: ObjectId,
  ): Promise<{ data: MedicalExaminationResult[] | []; pagination: any }>;
}

class MedicalExaminationResultRepositoryImpl
  extends BaseRepositoryImpl<MedicalExaminationResult>
  implements MedicalExaminationResultRepository
{
  constructor() {
    super(MedicalExaminationResultModel);
  }

  async findByPatientId(
    patientId: ObjectId,
  ): Promise<{ data: MedicalExaminationResult[] | []; pagination: any }> {
    const options: MongooseFindManyOptions = {
      filter: { patient: patientId },
      populateOptions: {
        path: 'patient prescription',
        select: 'name email phoneNumber address gender dateOfBirth',
      },
    };
    return this.findMany(options);
  }
}

export { type MedicalExaminationResultRepository, MedicalExaminationResultRepositoryImpl };
