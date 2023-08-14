import { Schema, model } from "mongoose";
import { IUser, IUserMethods, UserModel } from "./user.interface";
import { userRole } from "./user.constant";
import bcrypt from "bcryptjs";
import config from "../../../config";

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: userRole,
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
    budget: {
      type: Number,
      required: true,
      default: 0,
    },
    income: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function (next) {
  // hashing password
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

const User = model<IUser, UserModel>("User", userSchema);

export default User;
