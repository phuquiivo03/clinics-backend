import { z } from "zod";

// Schema for pricing options
const priceOptionSchema = z.object({
  tier: z.string().min(1, "Tier name is required"),
  price: z.number().positive("Price must be a positive number"),
  testsIncluded: z.number().int().min(0, "Tests included must be a non-negative integer")
});

// Schema for FAQ items
const faqItemSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required")
});

// Schema for booking options
const bookingOptionSchema = z.object({
  type: z.enum(["Branch", "Home Sample Collection"], {
    errorMap: () => ({ message: "Type must be either 'Branch' or 'Home Sample Collection'" })
  }),
  description: z.string().min(1, "Description is required"),
  actionUrl: z.string().min(1, "Action URL must is required")
});

// Schema for creating a consultation package
export const createConsultationPackageSchema = z.object({
  title: z.string().min(1, "Title is required"),
  icon: z.string().url("Icon must be a valid URL"),
  description: z.string().min(1, "Description is required"),
  features: z.array(z.string()).min(1, "At least one feature is required"),
  priceOptions: z.array(priceOptionSchema).min(1, "At least one price option is required"),
  maxSlotPerPeriod: z.number().int().positive("Max slot per period must be a positive integer"),
  tests: z.array(z.string().min(1, "Test ID is required")).min(1, "At least one test is required"),
  faq: z.array(faqItemSchema).optional(),
  bookingOptions: z.array(bookingOptionSchema).optional()
});

// Schema for updating a consultation package
export const updateConsultationPackageSchema = createConsultationPackageSchema.partial().extend({
  _id: z.string().min(1, "Consultation Package ID is required"),
});

// Schema for finding a consultation package by ID
export const findConsultationPackageByIdSchema = z.object({
  id: z.string().min(1, "Consultation Package ID is required"),
}); 