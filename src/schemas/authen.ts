import { z } from 'zod';

export const registerSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address'),
});

export const verifyOTPSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address'),
  code: z.string().min(6, 'Code must be at least 6 characters'),
});
