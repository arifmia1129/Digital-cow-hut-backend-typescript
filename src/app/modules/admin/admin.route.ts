import { Router } from "express";
import * as adminController from "./admin.controller";
import requestValidator from "../../middleware/requestValidator";
import * as adminValidation from "./admin.validation";

const adminRouter = Router();

adminRouter.post(
  "/create-admin",
  requestValidator(adminValidation.createAdminValidation),
  adminController.createAdmin,
);

adminRouter.post(
  "/login",
  requestValidator(adminValidation.loginAdminValidation),
  adminController.loginAdmin,
);

export default adminRouter;
