/* eslint-disable no-unused-vars */
import { HydratedDocument, Model } from "mongoose";

export type Name = {
  firstName: string;
  lastName: string;
};

export type IUser = {
  _id?: string;
  phoneNumber: string;
  role: "seller" | "buyer";
  password: string;
  name: Name;
  address: string;
  budget: number;
  income: number;
};

export type IUserMethods = {
  isUserExist(
    phoneNumber: string,
  ): Promise<Pick<IUser, "_id" | "phoneNumber" | "password" | "role"> | null>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string,
  ): Promise<boolean>;
};

export type UserModel = {
  createWithFullName(): Promise<HydratedDocument<IUser, IUserMethods>>;
  // name: string,
} & Model<IUser, object, IUserMethods>;
