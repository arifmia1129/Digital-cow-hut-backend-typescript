import { Router } from "express";
import * as userController from "./user.controller";
import requestValidator from "../../middleware/requestValidator";
import { updateUserValidation } from "./user.validation";

const userRouter = Router();

userRouter.get("/", userController.getUser);
userRouter
  .route("/:id")
  .get(userController.getUserById)
  .patch(requestValidator(updateUserValidation), userController.updateUserById)
  .delete(userController.deleteUserById);

export default userRouter;
