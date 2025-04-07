import { z } from "zod";

export const createDayPackageSchema = z.object({
  day_offset: z.number().min(0, "Day offset is required"),
  period_pkgs: z.array(z.string().min(1, "Period package ID is required")).default([])
});

export const updateDayPackageSchema = createDayPackageSchema.partial().extend({
  _id: z.string().min(1, "Day Package ID is required"),
});

export const findDayPackageByIdSchema = z.object({
  id: z.string().min(1, "Day Package ID is required"),
}); 