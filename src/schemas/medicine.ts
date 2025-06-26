import { z } from 'zod';

export const medicineSchema = z.object({
  name: z.string().min(1),
  dosage: z.string().min(1),
  form: z.string().min(1),
  route: z.string().min(1),
});

export const updateMedicineSchema = z.object({
  name: z.string().min(1).optional(),
  dosage: z.string().min(1).optional(),
  form: z.string().min(1).optional(),
  route: z.string().min(1).optional(),
});
