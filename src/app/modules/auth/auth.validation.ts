import { z } from "zod";

export const loginUserValidation = z.object({
  body: z.object({
    phoneNumber: z.string({
      required_error: "Phone number is required",
    }),
    password: z.string({
      required_error: "Password is required",
    }),
  }),
});

export const refreshTokenValidation = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: "Cookie is required",
    }),
  }),
});
