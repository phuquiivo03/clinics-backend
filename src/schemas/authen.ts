import { z } from 'zod';

export const registerSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, 'Phone number must be at least 10 characters')
    .max(15, 'Phone number must be at most 15 characters')
    .regex(/^[0-9]+$/, 'Phone number must contain only digits'),
});

export const verifyOTPSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, 'Phone number must be at least 10 characters')
    .max(15, 'Phone number must be at most 15 characters')
    .regex(/^[0-9]+$/, 'Phone number must contain only digits'),
  code: z.string().min(6, 'Code must be at least 6 characters'),
});
