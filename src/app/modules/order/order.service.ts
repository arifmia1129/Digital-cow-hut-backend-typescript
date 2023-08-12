/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { SortOrder } from "mongoose";
import { paginationHelper } from "../../../helpers/paginationHelper";
import {
  Pagination,
  ResponseWithPagination,
} from "../../../interfaces/databaseQuery.interface";
import ApiError from "../../../errors/ApiError";
import httpStatus from "../../../shared/httpStatus";
import { IOrder } from "./order.interface";
import Cow from "../cow/cow.model";
import Order from "./order.model";
import User from "../user/user.model";

export const createOrderService = async (
  order: IOrder,
): Promise<IOrder | null> => {
  // start session -> start transaction -> (commit transaction and end session) or (abort transaction and end session)

  let orderInfo;

  // start a session
  const session = await mongoose.startSession();

  try {
    // start transaction
    session.startTransaction();

    // find cow by id
    const isCowExists = await Cow.findById(order.cow);

    // throw error if cow not found
    if (!isCowExists) {
      throw new ApiError("Cow not found by giving id", httpStatus.BAD_REQUEST);
    }

    // find buyer by id
    const isBuyerExists = await User.findById(order.buyer);

    // throw error if cow not found
    if (!isBuyerExists) {
      throw new ApiError(
        "Buyer not found by giving id",
        httpStatus.BAD_REQUEST,
      );
    }

    if (isCowExists.price > isBuyerExists.budget) {
      throw new ApiError("Insufficient budget", httpStatus.BAD_REQUEST);
    }

    // try to create a new Order
    const newOrder = await Order.create([order], { session });

    // throw error if new Order not created
    // remember newOrder return an array
    if (!newOrder.length) {
      throw new ApiError(
        "Failed to create a new Order",
        httpStatus.BAD_REQUEST,
      );
    }

    orderInfo = newOrder[0];

    // change cow label
    isCowExists.label = "sold out";
    await isCowExists.save();

    // cut balance from buyer account
    // remember newOrder return an array
    isBuyerExists.budget -= isCowExists.price;

    await isBuyerExists.save();

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  if (orderInfo) {
    orderInfo = await Order.findById(orderInfo._id)
      .populate("cow")
      .populate("buyer");
  }
  return orderInfo || null;
};

export const getOrderService = async (
  paginationOptions: Pagination,
): Promise<ResponseWithPagination<IOrder[]>> => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

  const sortCondition: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortCondition[sortBy] = sortOrder;
  }

  const res = await Order.find()
    .populate("cow")
    .populate("buyer")
    .sort(sortCondition)
    .skip(skip)
    .limit(limit);

  const total = await Order.countDocuments();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: res,
  };
};
