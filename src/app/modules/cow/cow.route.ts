import { Router } from "express";
import * as cowController from "./cow.controller";
import requestValidator from "../../middleware/requestValidator";
import * as cowValidation from "./cow.valition";

const cowRouter = Router();

cowRouter
  .route("/")
  .post(
    requestValidator(cowValidation.createCowValidation),
    cowController.createCow,
  )
  .get(cowController.getCow);
cowRouter
  .route("/:id")
  .get(cowController.getCowById)
  .patch(
    requestValidator(cowValidation.updateCowValidation),
    cowController.updateCowById,
  )
  .delete(cowController.deleteCowById);

export default cowRouter;
