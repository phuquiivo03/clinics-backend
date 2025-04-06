import { z } from "zod";
import { GENDER } from "../types";

export const updateUserInfoSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email format").optional(),
    dateOfBirth: z.string()
        .or(z.date())
        .pipe(z.coerce.date())
        .refine((date) => date <= new Date(), "Date of birth cannot be in the future"),
    gender: z.enum([GENDER.MALE, GENDER.FEMALE, GENDER.OTHER], {
        errorMap: () => ({ message: "Gender must be a valid GENDER enum value" })
    }),
    address: z.string().min(5, "Address must be at least 5 characters")
});


export const createUserSchema = z.object({
    phoneNumber: z.string()
        .min(10, "Phone number must be at least 10 characters")
        .max(15, "Phone number must be at most 15 characters")
        .regex(/^[0-9]+$/, "Phone number must contain only digits"),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .max(100, "Password must be at most 100 characters")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, 
              "Password must contain at least 1 lowercase letter, 1 uppercase letter, and 1 number")
});