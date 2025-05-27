import { z } from 'zod';

// Schema for FAQ items
const faqItemSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  answer: z.string().min(1, 'Answer is required'),
});

// Schema for booking options
const bookingOptionSchema = z.object({
  type: z.enum(['Branch', 'Home Sample Collection'], {
    errorMap: () => ({ message: "Type must be either 'Branch' or 'Home Sample Collection'" }),
  }),
  description: z.string().min(1, 'Description is required'),
  actionUrl: z.string().min(1, 'Action URL must is required'),
});

// Schema for creating a consultation package
export const createConsultationPackageSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  titleImage: z.string().url('titleImage must be a valid URL'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  content: z.string().min(1, 'Content is required'),
  price: z.number(),
  tests: z.array(z.string().min(1, 'Test ID is required')),
  condition: z.string().min(0, 'Condition is required'),
  maxSlotPerPeriod: z.number().int().positive('Max slot per period must be a positive integer'),
  faq: z.array(faqItemSchema).optional(),
  bookingOption: z.string(),
});

// Schema for updating a consultation package
export const updateConsultationPackageSchema = createConsultationPackageSchema.partial().extend({
  _id: z.string().min(1, 'Consultation Package ID is required'),
});

// Schema for finding a consultation package by ID
export const findConsultationPackageByIdSchema = z.object({
  id: z.string().min(1, 'Consultation Package ID is required'),
});
