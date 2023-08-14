/* eslint-disable no-unused-vars */
import { Model } from "mongoose";

export type Name = {
  firstName: string;
  lastName: string;
};

export type IAdmin = {
  _id?: string;
  phoneNumber: string;
  role: "admin";
  password: string;
  name: Name;
  address: string;
};

export type LoginCredential = {
  phoneNumber: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken?: string;
};

export type RefreshToken = {
  accessToken: string;
};

export type IAdminMethods = {
  fullName(): string;
};

export type AdminModel = {
  isAdminExist(
    phoneNumber: string,
  ): Promise<Pick<IAdmin, "phoneNumber" | "password" | "role" | "_id"> | null>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string,
  ): Promise<boolean>;
} & Model<IAdmin, object, IAdminMethods>;
