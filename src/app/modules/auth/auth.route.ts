import { Router } from "express";
import * as authController from "./auth.controller";
import requestValidator from "../../middleware/requestValidator";
import * as userValidation from "../user/user.validation";
import * as authValidation from "./auth.validation";

const authRouter = Router();

authRouter.post(
  "/signup",
  requestValidator(userValidation.createUserValidation),
  authController.createUser,
);

authRouter.post(
  "/login",
  requestValidator(authValidation.loginUserValidation),
  authController.loginAuth,
);

authRouter.post("/refresh-token", authController.refreshTokenAuth);

export default authRouter;
