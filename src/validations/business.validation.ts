import {z } from "zod";

export const createBusinessSchema = z.object({
  name: z.string().trim().min(2, "Business name is required").max(150),
  
  description:z.string().trim().max(500).optional(),

  category:z.string().trim().min(2, "Category is required"),

  phone:z.string().trim().min(10,"Valid phone number is required").max(13),

  location:z.object({
    branchName:z.string().trim().optional(),

    addressLine:z.string().trim().min(5, "Address is required"),

    area:z.string().trim().optional(),

    city:z.string().trim().min(2, "City is required"),

    state:z.string().trim().min(2, "State is required"),

    postalCode:z.string().trim().min(6, "Postal code is required").max(10),

    latitude:z.number().min(-90).max(90).optional(),

    longitude:z.number().min(-180).max(180).optional(),

    phone: z.string().trim().min(10).max(15).optional().or(z.literal("")),
  })
})

export type CreateBusinessInput = z.infer<typeof createBusinessSchema>;