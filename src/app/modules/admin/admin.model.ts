import { Schema, model } from "mongoose";
import { AdminModel, IAdmin, IAdminMethods } from "./admin.interface";
import { adminRole } from "./admin.constant";
import config from "../../../config";
import bcrypt from "bcryptjs";

const adminSchema = new Schema<IAdmin, AdminModel, IAdminMethods>(
  {
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: adminRole,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    name: {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
      },
    },
    address: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

adminSchema.pre("save", async function (next) {
  // hashing password
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

const Admin = model<IAdmin, AdminModel>("Admin", adminSchema);

export default Admin;
