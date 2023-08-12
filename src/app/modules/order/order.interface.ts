import { HydratedDocument, Model, Types } from "mongoose";
import { ICow } from "../cow/cow.interface";
import { IUser } from "../user/user.interface";

export type IOrder = {
  cow: Types.ObjectId | ICow;
  buyer: Types.ObjectId | IUser;
};

export type IOrderMethods = {
  fullName(): string;
};

export type OrderModel = {
  createWithFullName(): Promise<HydratedDocument<IOrder, IOrderMethods>>;
  // name: string,
} & Model<IOrder, object, IOrderMethods>;
