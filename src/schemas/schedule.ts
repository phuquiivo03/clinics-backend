import { z } from 'zod';

// Status validation - using corrected values from ScheduleStatus enum
const scheduleStatusEnum = ['pending', 'confirmed', 'checkedin'] as const;

// Schema for creating a schedule
export const createScheduleSchema = z.object({
  dayOffset: z.number().int().min(0, 'Day offset must be a non-negative integer'),
  timeOffset: z
    .number()
    .int()
    .min(0, 'Time offset must be a non-negative integer')
    .max(1, 'Time offset must be 0 or 1'),
  packageId: z.string().optional(),
  services: z
    .array(z.string().refine((val) => val.length > 0, 'At least one service ID is required'))
    .optional(),
  type: z.enum(['package', 'services'], { message: 'Type must be either "package" or "services"' }),
  weekPeriod: z.object({
    from: z.string().min(1, 'From date is required'),
    to: z.string().min(1, 'To date is required'),
  }),
});

// Schema for updating a schedule
export const updateScheduleSchema = createScheduleSchema.partial().extend({
  id: z.string().min(1, 'Schedule ID is required'),
});

// Schema for finding a schedule by ID
export const findScheduleByIdSchema = z.object({
  id: z.string().min(1, 'Schedule ID is required'),
});

export const findBySpecializationSchema = z.object({
  specialization: z.string().min(1, 'Specialization ID is required'),
  dateRange: z
    .string(),
  timeOffset: z
    .string()
    .min(0, 'Time offset must be a non-negative integer')
    .max(1, 'Time offset must be 0 or 1'),
  dayOffset: z.string().min(0, 'Day offset must be a non-negative integer'),
});
