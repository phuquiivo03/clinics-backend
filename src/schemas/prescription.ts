import { z } from 'zod';

export const createPrescriptionSchema = z.object({
  patient: z.string().min(1, 'Patient ID is required'),
  diagnosis: z.string().min(1, 'Diagnosis is required'),
  notes: z.string().optional(),
  medications: z
    .array(z.string().min(1, 'Medication ID is required'))
    .min(1, 'At least one medication is required'),
  totalCost: z.number().min(0, 'Total cost must be non-negative'),
});

export const updatePrescriptionSchema = z.object({
  diagnosis: z.string().min(1).optional(),
  notes: z.string().optional(),
  medications: z.array(z.string().min(1)).optional(),
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
