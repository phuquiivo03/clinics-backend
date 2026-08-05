import { z } from 'zod';
import { GENDER } from '../types';

export const updateUserInfoSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email format').optional(),
  dateOfBirth: z
    .string()
    .or(z.date())
    .pipe(z.coerce.date())
    .refine((date) => date <= new Date(), 'Date of birth cannot be in the future')
    .optional(),
  gender: z
    .enum([GENDER.MALE, GENDER.FEMALE, GENDER.OTHER], {
      errorMap: () => ({ message: 'Gender must be a valid GENDER enum value' }),
    })
    .optional(),
  address: z.string().min(5, 'Address must be at least 5 characters').optional(),
});

export const createUserSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, 'Phone number must be at least 10 characters')
    .max(15, 'Phone number must be at most 15 characters')
    .regex(/^[0-9]+$/, 'Phone number must contain only digits'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be at most 100 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
      'Password must contain at least 1 lowercase letter, 1 uppercase letter, and 1 number',
    ),
    email: z.string().email('Invalid email format'),
});


export const unsignupUserSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, 'Phone number must be at least 10 characters')
    .max(15, 'Phone number must be at most 15 characters')
    .regex(/^[0-9]+$/, 'Phone number must contain only digits'),
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email format').optional(),
  dateOfBirth: z
    .string()
    .or(z.date())
    .pipe(z.coerce.date())
    .refine((date) => date <= new Date(), 'Date of birth cannot be in the future')
    .optional(),
  address: z.string().min(5, 'Address must be at least 5 characters').optional(),
  gender: z
    .enum([GENDER.MALE, GENDER.FEMALE, GENDER.OTHER], {
      errorMap: () => ({ message: 'Gender must be a valid GENDER enum value' }),
    })
    .optional(),
  occupation: z.string().min(2, 'Occupation must be at least 2 characters').optional(),
});
