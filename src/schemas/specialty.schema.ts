import { z } from 'zod';

export const createSpecialtySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
});
export const createSpecialtyManySchema = z.array(createSpecialtySchema);
export const updateSpecialtySchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  description: z.string().min(1, 'Description is required').optional(),
});
