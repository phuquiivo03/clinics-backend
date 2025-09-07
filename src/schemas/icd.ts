import { z } from 'zod';

export const icdSchema = z.object({
  code: z.string().min(1, 'Code is required').trim(),
  range: z.string().min(1, 'Range is required').trim(),
  title: z.string().min(1, 'Title is required').trim(),
});

export const updateIcdSchema = z.object({
  code: z.string().min(1).trim().optional(),
  range: z.string().min(1).trim().optional(),
  title: z.string().min(1).trim().optional(),
});

export const searchIcdSchema = z.object({
  query: z.string().min(1, 'Search query is required').trim(),
});

export const createManyIcdSchema = z.object({
  icds: z.array(icdSchema).min(1, 'At least one ICD is required'),
});