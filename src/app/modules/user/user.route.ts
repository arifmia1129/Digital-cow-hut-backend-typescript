import { Router } from "express";
import * as userController from "./user.controller";
import requestValidator from "../../middleware/requestValidator";
import { updateUserValidation } from "./user.validation";
import auth from "../../middleware/auth";
import { USER_ROLE_ENUM } from "../../../enums/user.enum";

const userRouter = Router();

userRouter.get("/", auth(USER_ROLE_ENUM.ADMIN), userController.getUser);
userRouter.get(
  "/my-profile",
  auth(USER_ROLE_ENUM.SELLER, USER_ROLE_ENUM.BUYER),
  userController.getUserProfileByToken,
);
userRouter.patch(
  "/my-profile",
  auth(USER_ROLE_ENUM.SELLER, USER_ROLE_ENUM.BUYER),
  userController.updateUserProfileByToken,
);
userRouter
  .route("/:id")
  .all(auth(USER_ROLE_ENUM.ADMIN))
  .get(userController.getUserById)
  .patch(requestValidator(updateUserValidation), userController.updateUserById)
  .delete(userController.deleteUserById);

export default userRouter;
