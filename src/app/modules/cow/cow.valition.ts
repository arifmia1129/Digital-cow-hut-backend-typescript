import { z } from "zod";
import { cowBread, cowCategory, cowLabel, cowLocation } from "./cow.constant";

export const createCowValidation = z.object({
  name: z.string({
    required_error: "Cow name is required",
  }),
  age: z.number({
    required_error: "Cow age is required",
  }),
  price: z.number({
    required_error: "Cow price is required",
  }),
  location: z.enum([...cowLocation] as [string, ...string[]], {
    required_error: "Cow location is required",
  }),
  bread: z.enum([...cowBread] as [string, ...string[]], {
    required_error: "Cow bread is required",
  }),
  weight: z.number({
    required_error: "Cow weight is required",
  }),
  label: z.enum([...cowLabel] as [string, ...string[]], {
    required_error: "Cow label is required",
  }),
  category: z.enum([...cowCategory] as [string, ...string[]], {
    required_error: "Cow category is required",
  }),
  seller: z.string({
    required_error: "Seller id is required",
  }),
});

export const cowUpdateValidation = z.object({
  name: z.string().optional(),
  age: z.number().optional(),
  price: z.number().optional(),
  location: z.enum([...cowLocation] as [string, ...string[]]).optional(),
  bread: z.enum([...cowBread] as [string, ...string[]]).optional(),
  weight: z.number().optional(),
  label: z.enum([...cowLabel] as [string, ...string[]]).optional(),
  category: z.enum([...cowCategory] as [string, ...string[]]).optional(),
  seller: z.string().optional(),
});
