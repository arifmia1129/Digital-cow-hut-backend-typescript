import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodEffects } from "zod";

const requestValidator = (schema: AnyZodObject | ZodEffects<AnyZodObject>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default requestValidator;
