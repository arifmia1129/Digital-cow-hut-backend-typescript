import { Schema, model } from "mongoose";
import { CowModel, ICow, ICowMethods } from "./cow.interface";
import { cowBread, cowCategory, cowLabel, cowLocation } from "./cow.constant";

const cowSchema = new Schema<ICow, CowModel, ICowMethods>(
  {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      enum: cowLocation,
      required: true,
    },
    bread: {
      type: String,
      enum: cowBread,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    label: {
      type: String,
      required: true,
      enum: cowLabel,
    },
    category: {
      type: String,
      required: true,
      enum: cowCategory,
    },
    seller: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

const Cow = model<ICow, CowModel>("Cow", cowSchema);

export default Cow;
