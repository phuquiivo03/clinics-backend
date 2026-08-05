import { z } from 'zod';

export const createPackageWeekSchema = z.object({
  startDate: z.string().refine((value) => !isNaN(Date.parse(value)), {
    message: 'Start date must be a valid date string',
  }),
  endDate: z.string().refine((value) => !isNaN(Date.parse(value)), {
    message: 'End date must be a valid date string',
  }),
  packageDays: z.array(z.string().min(1, 'Package day ID is required')).default([]),
});

export const updatePackageWeekSchema = createPackageWeekSchema.partial().extend({
  _id: z.string().min(1, 'Package Week ID is required'),
});

export const findPackageWeekByIdSchema = z.object({
  id: z.string().min(1, 'Package Week ID is required'),
});
