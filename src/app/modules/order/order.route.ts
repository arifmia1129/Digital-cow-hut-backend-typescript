import { Router } from "express";
import * as orderController from "./order.controller";
import requestValidator from "../../middleware/requestValidator";
import * as orderValidation from "./order.validation";
import auth from "../../middleware/auth";
import { USER_ROLE_ENUM } from "../../../enums/user.enum";

const orderRouter = Router();

orderRouter
  .route("/")
  .post(
    requestValidator(orderValidation.createOrderValidation),
    auth(USER_ROLE_ENUM.BUYER),
    orderController.createOrder,
  )
  .get(
    auth(USER_ROLE_ENUM.ADMIN, USER_ROLE_ENUM.BUYER, USER_ROLE_ENUM.SELLER),
    orderController.getOrder,
  );
export default orderRouter;
