import { Schema, model } from "mongoose";
import { IOrder, IOrderMethods, OrderModel } from "./order.interface";

const orderSchema = new Schema<IOrder, OrderModel, IOrderMethods>(
  {
    cow: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Cow",
    },
    buyer: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

const Order = model<IOrder, OrderModel>("Order", orderSchema);

export default Order;
