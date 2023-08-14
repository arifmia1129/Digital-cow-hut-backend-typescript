import { Router } from "express";
import * as adminController from "./admin.controller";
import requestValidator from "../../middleware/requestValidator";
import { createAdminValidation } from "./admin.validation";

const adminRouter = Router();

adminRouter.post(
  "/create-admin",
  requestValidator(createAdminValidation),
  adminController.createAdmin,
);

export default adminRouter;
