import { z } from 'zod';
import { medicationSchema } from './medication';

export const prescriptionSchema = z.object({
  patient: z.string(),
  diagnosis: z.string().min(1),
  notes: z.string().optional(),
  medications: z.array(
    z.union([
      z.string(), // ObjectId as string
      medicationSchema // Full medication object
    ])
  ).min(1),
  totalCost: z.number().min(0),
});

export const updatePrescriptionSchema = z.object({
  diagnosis: z.string().min(1).optional(),
  notes: z.string().optional(),
  medications: z.array(
    z.union([
      z.string(), // ObjectId as string
      medicationSchema // Full medication object
    ])
  ).min(1).optional(),
  totalCost: z.number().min(0).optional(),
});

export const updatePaymentStatusSchema = z.object({
  isPaid: z.boolean(),
});

export const prescriptionFiltersSchema = z.object({
  isPaid: z
    .string()
    .transform((val) => val === 'true')
    .optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});
