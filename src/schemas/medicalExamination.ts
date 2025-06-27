import { z } from 'zod';

export const ICDCodeSchema = z.object({
  icdCode: z.string(),
  description: z.string(),
});

export const SubclinicalResultSchema = z.object({
  service: z.string(),
  resultData: z.string(),
  performedAt: z.string().or(z.date()),
  performedBy: z.string().optional(),
  notes: z.string().optional(),
});

export const MedicalExaminationResultCreateSchema = z.object({
  patient: z.string(),
  examinationDate: z.string(),
  symptoms: z.array(z.string()),
  subclinicalResults: z.array(SubclinicalResultSchema).optional(),
  finalDiagnosis: z.array(ICDCodeSchema).optional(),
  prescription: z.string().optional(),
  followUp: z
    .object({
      nextVisit: z.string().optional(),
      notes: z.string().optional(),
    })
    .optional(),
});

export const MedicalExaminationResultUpdateSchema = MedicalExaminationResultCreateSchema.partial();
