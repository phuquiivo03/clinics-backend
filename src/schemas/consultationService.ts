import { z } from "zod";

// Schema for creating a consultation service
export const createConsultationServiceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  duration: z.number().int().positive("Duration must be a positive number"),
  room: z.string().min(1, "Room ID is required"),
  doctor: z.string().min(1, "Doctor ID is required"),
  price: z.number().positive("Price must be a positive number"),
});

// Schema for updating a consultation service
export const updateConsultationServiceSchema = createConsultationServiceSchema.partial().extend({
  _id: z.string().min(1, "Consultation Service ID is required"),
});

// Schema for finding a consultation service by ID
export const findConsultationServiceByIdSchema = z.object({
  id: z.string().min(1, "Consultation Service ID is required"),
}); 