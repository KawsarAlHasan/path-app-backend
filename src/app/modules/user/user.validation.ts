import { z } from "zod";

export const getUserZodSchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .transform((val) => (val ? Number(val) : 1))
      .refine((val) => Number.isInteger(val) && val > 0, {
        message: "Page must be a positive integer",
      }),

    limit: z
      .string()
      .optional()
      .transform((val) => (val ? Number(val) : 10))
      .refine((val) => Number.isInteger(val) && val > 0 && val <= 500, {
        message: "Limit must be between 1 and 500",
      }),

    search: z.string().optional(),

    status: z.enum(["ACTIVE", "INACTIVE", "BLOCKED", "DELETED"]).optional(),
  }),
});

export const updateUserStatusZodSchema = z.object({
  body: z.object({
    id: z.string().min(1, "Id is required"),
    status: z.enum(["ACTIVE", "PENDING", "INACTIVE", "SUSPENDED"], {
      error: "Status must be one of ACTIVE, PENDING, INACTIVE, or SUSPENDED",
    }),
  }),
});
