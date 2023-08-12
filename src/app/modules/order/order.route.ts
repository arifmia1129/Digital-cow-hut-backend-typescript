import { Router } from "express";
import * as orderController from "./order.controller";
import requestValidator from "../../middleware/requestValidator";
import * as orderValidation from "./order.validation";

const orderRouter = Router();

orderRouter
  .route("/")
  .post(
    requestValidator(orderValidation.createOrderValidation),
    orderController.createOrder,
  )
  .get(orderController.getOrder);
export default orderRouter;
