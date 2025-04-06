import { z } from "zod";

export const createDoctorSchema = z.object({
    specialization: z.string().min(1, "Specialization is required"),
    experience: z.number().min(0, "Experience must be a positive number"),
    qualifications: z.array(z.string()),
    consultationFee: z.number().min(0, "Consultation fee must be a positive number")
})
 

export const updateDoctorSchema = createDoctorSchema.partial().extend({
    _id: z.string().min(1, "Doctor ID is required"),
    experience: z.number().min(0, "Experience must be a positive number").optional(),
    qualifications: z.array(z.string()).optional(),
    consultationFee: z.number().min(0, "Consultation fee must be a positive number").optional()
})