import { Schema, model } from 'mongoose';
import { type MedicalExaminationResult } from '../types/medicalExamination';

const ICDCodeSchema = new Schema(
  {
    icdCode: { type: String, required: true },
    description: { type: String, required: true },
  },
  { _id: false },
);

const SubclinicalResultSchema = new Schema(
  {
    service: { type: Schema.Types.ObjectId, ref: 'ConsultationService', required: true },
    resultData: { type: String, required: true },
    performedAt: { type: Date, required: true },
    performedBy: { type: Schema.Types.ObjectId, ref: 'Doctor' },
    notes: { type: String },
  },
  { _id: false },
);

const MedicalExaminationResultSchema = new Schema<MedicalExaminationResult>(
  {
    patient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    examinationDate: { type: String, required: true },
    symptoms: [{ type: String, required: true }],
    subclinicalResults: [SubclinicalResultSchema],
    services: [{ type: Schema.Types.ObjectId, ref: 'ConsultationService' }],
    finalDiagnosis: [ICDCodeSchema],
    prescription: { type: Schema.Types.ObjectId, ref: 'Prescription' },
    followUp: {
      notes: { type: String },
      schedule: { type: Schema.Types.ObjectId, ref: 'Schedule' },
    },
  },
  { timestamps: true },
);

export const MedicalExaminationResultModel = model<MedicalExaminationResult>(
  'MedicalExaminationResult',
  MedicalExaminationResultSchema,
);
