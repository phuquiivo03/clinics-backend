import type { ObjectId } from 'mongoose';
import type { User } from './user';
import type { Doctor } from './doctor';
import type { Prescription } from './prescription';
import type { ConsultationService } from './consultationService';

export type MedicalExaminationResult = {
  _id?: ObjectId;
  patient: User | ObjectId;
  examinationDate: string;
  symptoms: string[];
  subclinicalResults: SubclinicalResult[];
  services: ConsultationService[] | ObjectId[];
  finalDiagnosis?: ICDCode[];
  prescription?: Prescription | ObjectId;
  followUp?: {
    nextVisit?: string;
    notes?: string;
  };
};

export type SubclinicalResult = {
  service: ConsultationService | ObjectId;
  resultData: string; // từng service có resultData khác nhau
  performedAt: Date; // ISO date
  performedBy?: Doctor | ObjectId;
  notes?: string;
};

export type ICDCode = {
  icdCode: string;
  description: string;
};
