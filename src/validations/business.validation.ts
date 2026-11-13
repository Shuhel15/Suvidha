import { z } from "zod";

export const businessHoursSchema = z.object({
  hours: z
    .array(
      z.object({
        dayOfWeek: z.number().int().min(1).max(7),

        openTime: z
          .string()
          .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid opening time")
          .nullable(),

        closeTime: z
          .string()
          .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid closing time")
          .nullable(),

        isClosed: z.boolean(),
      }),
    )
    .length(7, "Exactly 7 days are required")

    .superRefine((hours, ctx) => {
      const uniqueDays = new Set(hours.map((hour) => hour.dayOfWeek));

      if (uniqueDays.size !== 7) {
        ctx.addIssue({
          code: "custom",
          message: "Each day must appear exactly once",
        });
      }

      hours.forEach((hour, index) => {
        if (!hour.isClosed) {
          if (!hour.openTime) {
            ctx.addIssue({
              code: "custom",
              path: [index, "openTime"],
              message: "Opening time is required",
            });
          }

          if (!hour.closeTime) {
            ctx.addIssue({
              code: "custom",
              path: [index, "closeTime"],
              message: "Closing time is required",
            });
          }

          // Closing time must be after opening time
          if (
            hour.openTime &&
            hour.closeTime &&
            hour.closeTime <= hour.openTime
          ) {
            ctx.addIssue({
              code: "custom",
              path: [index, "closeTime"],
              message: "Closing time must be after opening time",
            });
          }
        }
      });
    })
    .transform((hours) =>
      hours.map((hour) =>
        hour.isClosed ? { ...hour, openTime: null, closeTime: null } : hour,
      ),
    ),
});

export const createBusinessSchema = z.object({
  name: z.string().trim().min(2, "Business name is required").max(150),
  description: z.string().trim().max(500).optional(),
  category: z.string().trim().min(2, "Category is required"),
  phone: z.string().trim().min(10, "Valid phone number is required").max(13),

  location: z.object({
    branchName: z.string().trim().optional(),
    addressLine: z.string().trim().min(5, "Address is required"),
    area: z.string().trim().optional(),
    city: z.string().trim().min(2, "City is required"),
    state: z.string().trim().min(2, "State is required"),
    postalCode: z.string().trim().min(6, "Postal code is required").max(10),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    phone: z.string().trim().min(10).max(15).optional().or(z.literal("")),
  }),
  hours: businessHoursSchema.shape.hours,
});

export type CreateBusinessInput = z.infer<typeof createBusinessSchema>;
