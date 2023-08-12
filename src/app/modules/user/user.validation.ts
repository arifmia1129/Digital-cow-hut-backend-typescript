import { z } from "zod";
import { userRole } from "./user.constant";

export const createUserValidation = z.object({
  phoneNumber: z.string({
    required_error: "Phone number is required",
  }),
  role: z.enum([...userRole] as [string, ...string[]], {
    required_error: "Role is required",
  }),
  password: z.string({
    required_error: "Password is required",
  }),
  name: z.object({
    firstName: z.string({
      required_error: "First name must be required",
    }),
    lastName: z.string().optional(),
  }),
  address: z.string({
    required_error: "Address is required",
  }),
  budget: z.number().optional(),
  income: z.number().optional(),
});

export const updateUserValidation = z.object({
  phoneNumber: z.string().optional(),
  role: z.enum([...userRole] as [string, ...string[]]).optional(),
  password: z.string().optional(),
  name: z
    .object({
      firstName: z.string().optional(),
      lastName: z.string().optional(),
    })
    .optional(),
  address: z.string().optional(),
  budget: z.number().optional(),
  income: z.number().optional(),
});
