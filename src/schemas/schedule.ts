import { z } from "zod";

// Status validation - assuming valid status values
const scheduleStatusEnum = ["pending", "confirmed", "cancelled", "completed"] as const;

// Schema for creating a schedule
export const createScheduleSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  date: z.string().refine(value => !isNaN(Date.parse(value)), {
    message: "Date must be a valid date string"
  }),
  start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Start time must be in HH:MM format"),
  end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "End time must be in HH:MM format"),
  status: z.enum(scheduleStatusEnum, {
    errorMap: () => ({ message: `Status must be one of: ${scheduleStatusEnum.join(", ")}` })
  }),
  package_id: z.string().min(1, "Package ID is required").optional(),
  package_period_id: z.string().min(1, "Package Week ID is required"),
});

// Schema for updating a schedule
export const updateScheduleSchema = createScheduleSchema.partial().extend({
  id: z.string().min(1, "Schedule ID is required"),
});

// Schema for finding a schedule by ID
export const findScheduleByIdSchema = z.object({
  id: z.string().min(1, "Schedule ID is required"),
}); 