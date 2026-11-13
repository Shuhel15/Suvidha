
import { z } from "zod";

export const createServiceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Service name must be at least 2 characters")
    .max(100, "Service name cannot exceed 100 characters"),

  description: z
    .string()
    .trim()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),

  price: z
    .number()
    .positive("Price must be greater than 0"),

  duration: z
    .number()
    .int("Duration must be a whole number")
    .positive("Duration must be greater than 0"),
});

export type CreateServiceInput = z.infer<
  typeof createServiceSchema
>;


export const updateServiceStatusSchema = z.object({
  isActive: z.boolean({
    error: "Invalid service status",
  }),
});
