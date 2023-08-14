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

// defined static to check admin exist or not
adminSchema.statics.isAdminExist = async function (
  phoneNumber: string,
): Promise<Pick<IAdmin, "_id" | "phoneNumber" | "password" | "role"> | null> {
  return await this.findOne(
    { phoneNumber },
    { _id: 1, phoneNumber: 1, password: 1, role: 1 },
  );
};

// defined static to check password valid or not
adminSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

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
