import { z } from "zod";

export const createOrderValidation = z.object({
  body: z.object({
    cow: z.string({
      required_error: "Cow id is required",
    }),
    buyer: z.string({
      required_error: "Buyer id is required",
    }),
  }),
});

export const updateOrderValidation = z.object({
  body: z.object({
    cow: z.string().optional(),
    buyer: z.string().optional(),
  }),
});
