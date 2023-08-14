import { Router } from "express";
import * as authController from "./auth.controller";
import requestValidator from "../../middleware/requestValidator";
import { createUserValidation } from "../user/user.validation";

const authRouter = Router();

authRouter.post(
  "/signup",
  requestValidator(createUserValidation),
  authController.createUser,
);

export default authRouter;
