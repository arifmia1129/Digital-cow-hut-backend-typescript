import { HydratedDocument, Model } from "mongoose";

export type Name = {
  firstName: string;
  lastName: string;
};

export type IAdmin = {
  phoneNumber: string;
  role: "admin";
  password: string;
  name: Name;
  address: string;
};

export type IAdminMethods = {
  fullName(): string;
};

export type AdminModel = {
  createWithFullName(): Promise<HydratedDocument<IAdmin, IAdminMethods>>;
  // name: string,
} & Model<IAdmin, object, IAdminMethods>;
