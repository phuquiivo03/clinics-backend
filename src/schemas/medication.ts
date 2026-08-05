import { z } from 'zod';

export const medicationSchema = z.object({
  medicine: z.string(), // ObjectId reference to Medicine
  quantity: z.number().min(1),
  frequency: z.string().min(1),
  duration: z.string().min(1),
  instruction: z.string().optional(),
});

export const updateMedicationSchema = z.object({
  medicine: z.string().optional(),
  quantity: z.number().min(1).optional(),
  frequency: z.string().min(1).optional(),
  duration: z.string().min(1).optional(),
  instruction: z.string().optional(),
});
