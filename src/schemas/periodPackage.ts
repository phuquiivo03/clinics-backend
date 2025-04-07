import { z } from "zod";

export const createPeriodPackageSchema = z.object({
  pkg: z.string().min(1, "Package ID is required"),
  booked: z.number().int().min(0, "Booked slots must be a non-negative number").default(0),
  startTime: z.string().or(z.date()).transform(val => new Date(val)),
  endTime: z.string().or(z.date()).transform(val => new Date(val))
});

export const updatePeriodPackageSchema = createPeriodPackageSchema.partial().extend({
  _id: z.string().min(1, "Period Package ID is required"),
});

export const findPeriodPackageByIdSchema = z.object({
  id: z.string().min(1, "Period Package ID is required"),
}); 