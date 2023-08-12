import { HydratedDocument, Model, Types } from "mongoose";
import { IUser } from "../user/user.interface";

export type ICow = {
  name: string;
  age: number;
  price: number;
  location:
    | "Dhaka"
    | "Chattogram"
    | "Barishal"
    | "Rajshahi"
    | "Sylhet"
    | "Comilla"
    | "Rangpur"
    | "Mymensingh";
  bread:
    | "Brahman"
    | "Nellore"
    | "Sahiwal"
    | "Gir"
    | "Indigenous"
    | "Tharparkar";
  weight: number;
  label: "for sale" | "sold out";
  category: "Dairy" | "Beef" | "DualPurpose";
  seller: Types.ObjectId | IUser;
};

export type ICowMethods = {
  fullName(): string;
};

export type CowModel = {
  createWithFullName(): Promise<HydratedDocument<ICow, ICowMethods>>;
  // name: string,
} & Model<ICow, object, ICowMethods>;
