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
  services: z.array(z.string()).optional(), // Array of ConsultationService IDs
  finalDiagnosis: z.array(ICDCodeSchema).optional(),
  prescription: z.string().optional(),
  scheduleReferrence: z.string().optional(),
  followUp: z
    .object({
      notes: z.string().optional(),
      schedule: z.string().optional(),
    })
    .optional(),
});

export const MedicalExaminationAddFollowUpSchema = z.object({
  notes: z.string().optional(),
  schedule: z
    .object({
      userId: z.string(),
      services: z.array(z.string()),
      dayOffset: z.number().int().min(0, 'Day offset must be a non-negative integer'),
      timeOffset: z
        .number()
        .int()
        .min(0, 'Time offset must be a non-negative integer')
        .max(1, 'Time offset must be 0 or 1'),
      weekPeriod: z.object({
        from: z.string(),
        to: z.string(),
      }),
    })
    .optional(),
});

export const MedicalExaminationResultUpdateSchema = MedicalExaminationResultCreateSchema.partial();
