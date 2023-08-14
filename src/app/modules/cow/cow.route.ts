import { Router } from "express";
import * as cowController from "./cow.controller";
import requestValidator from "../../middleware/requestValidator";
import * as cowValidation from "./cow.validation";
import auth from "../../middleware/auth";
import { USER_ROLE_ENUM } from "../../../enums/user.enum";

const cowRouter = Router();

cowRouter
  .route("/")
  .post(
    requestValidator(cowValidation.createCowValidation),
    auth(USER_ROLE_ENUM.SELLER),
    cowController.createCow,
  )
  .get(
    auth(USER_ROLE_ENUM.SELLER, USER_ROLE_ENUM.BUYER, USER_ROLE_ENUM.ADMIN),
    cowController.getCow,
  );
cowRouter
  .route("/:id")
  .get(
    auth(USER_ROLE_ENUM.SELLER, USER_ROLE_ENUM.BUYER, USER_ROLE_ENUM.ADMIN),
    cowController.getCowById,
  )
  .patch(
    requestValidator(cowValidation.updateCowValidation),
    auth(USER_ROLE_ENUM.SELLER),
    cowController.updateCowById,
  )
  .delete(auth(USER_ROLE_ENUM.SELLER), cowController.deleteCowById);

export default cowRouter;
