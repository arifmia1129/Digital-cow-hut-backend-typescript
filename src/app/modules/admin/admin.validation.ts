import { z } from "zod";
import { adminRole } from "./admin.constant";

export const createAdminValidation = z.object({
  body: z.object({
    phoneNumber: z.string({
      required_error: "Phone number is required",
    }),
    role: z.enum([...adminRole] as [string, ...string[]], {
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
  }),
});

export const loginAdminValidation = z.object({
  body: z.object({
    phoneNumber: z.string({
      required_error: "Phone number is required",
    }),
    password: z.string({
      required_error: "Password is required",
    }),
  }),
});
