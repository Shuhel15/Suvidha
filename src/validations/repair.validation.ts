import { z } from "zod";

export const createRepairJobSchema = z.object({
  businessId: z.string().min(1, "Business ID is required"),

  serviceId: z.string().optional(),

  itemName: z
    .string()
    .trim()
    .min(2, "Item name must be at least 2 characters")
    .max(100),

  issue: z
    .string()
    .trim()
    .min(5, "Please describe the issue")
    .max(1000),

  estimatedCost: z
    .number()
    .positive("Estimated cost must be positive")
    .optional(),
});