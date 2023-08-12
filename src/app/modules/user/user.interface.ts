import { HydratedDocument, Model } from "mongoose";

type Name = {
  firstName: string;
  lastName: string;
};

export type IUser = {
  phoneNumber: string;
  role: "seller" | "buyer";
  password: string;
  name: Name;
  address: string;
  budget: number;
  income: number;
};

export type IUserMethods = {
  fullName(): string;
};

export type UserModel = {
  createWithFullName(): Promise<HydratedDocument<IUser, IUserMethods>>;
  // name: string,
} & Model<IUser, object, IUserMethods>;
