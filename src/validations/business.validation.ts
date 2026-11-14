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
  name: z.string().trim().min(2, "Business name is required").max(100),
  description: z.preprocess(
    (value) =>
      typeof value === "string" && value.trim() === "" ? undefined : value,
    z
      .string()
      .trim()
      .max(500, "Description cannot exceed 500 characters")
      .optional(),
  ),
  category: z.enum(["SALON", "CLINIC", "REPAIR"], {
    error: "Please select a valid business category",
  }),
  phone: z
    .string()
    .trim()
    .regex(/^\d{10,15}$/, "Phone number must contain 10–15 digits"),
  location: z
    .object({
      branchName: z.string().trim().optional(),
      addressLine: z.string().trim().min(5, "Address is required"),
      area: z.string().trim().optional(),
      city: z.string().trim().min(2, "City is required"),
      state: z.string().trim().min(2, "State is required"),
      postalCode: z
        .string()
        .trim()
        .regex(/^[1-9]\d{5}$/, "Enter a valid 6-digit Indian PIN code"),
      latitude: z.number().min(-90).max(90).optional(),
      longitude: z.number().min(-180).max(180).optional(),
      phone: z
        .string()
        .trim()
        .refine(
          (value) => value === "" || /^\d{10,15}$/.test(value),
          "Phone number must contain 10–15 digits",
        )
        .optional(),
    })
    .superRefine((location, ctx) => {
      const hasLatitude = location.latitude !== undefined;
      const hasLongitude = location.longitude !== undefined;

      if (hasLatitude !== hasLongitude) {
        ctx.addIssue({
          code: "custom",
          path: [hasLatitude ? "longitude" : "latitude"],
          message: "Latitude and Longitude must be provided together",
        });
      }
    }),
  hours: businessHoursSchema.shape.hours,
});

export type CreateBusinessInput = z.infer<typeof createBusinessSchema>;
