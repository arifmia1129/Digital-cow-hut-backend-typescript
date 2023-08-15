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
import { JwtPayload } from "jsonwebtoken";

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

    // if cow label is sold throw error
    if (isCowExists.label === "sold out") {
      throw new ApiError(
        "Cow is already sold. Try to buy a another cow.",
        httpStatus.BAD_REQUEST,
      );
    }

    // get seller
    const seller = await User.findById(isCowExists.seller);

    if (!seller) {
      throw new ApiError(
        "Cow seller is not found by giving id",
        httpStatus.BAD_REQUEST,
      );
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
    await Cow.findOneAndUpdate(
      { _id: order.cow },
      {
        label: "sold out",
      },
      { session },
    );

    // cut balance from buyer account
    // remember newOrder return an array

    await User.findOneAndUpdate(
      { _id: order.buyer },
      {
        budget: (isBuyerExists.budget -= isCowExists.price),
      },
      { session },
    );

    // add balance buyer to seller
    await User.findOneAndUpdate(
      { _id: isCowExists.seller },
      {
        income: (seller.income += isCowExists.price),
      },
      { session },
    );

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  if (orderInfo) {
    orderInfo = await Order.findById(orderInfo._id)
      .populate({
        path: "cow",
        populate: [{ path: "seller" }],
      })
      .populate("buyer");
  }
  return orderInfo || null;
};

export const getOrderService = async (
  paginationOptions: Pagination,
  userInfo: JwtPayload,
): Promise<ResponseWithPagination<IOrder[] | null>> => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

  const sortCondition: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortCondition[sortBy] = sortOrder;
  }

  let res;

  if (userInfo.role === "admin") {
    res = await Order.find()
      .populate({
        path: "cow",
        populate: [{ path: "seller" }],
      })
      .populate("buyer")
      .sort(sortCondition)
      .skip(skip)
      .limit(limit);
  } else if (userInfo.role === "buyer") {
    res = await Order.find({ buyer: userInfo.id })
      .populate({
        path: "cow",
        populate: [{ path: "seller" }],
      })
      .populate("buyer")
      .sort(sortCondition)
      .skip(skip)
      .limit(limit);
  } else if (userInfo.role === "seller") {
    const orders = await Order.find()
      .populate({
        path: "cow",
        populate: {
          path: "seller",
        },
      })
      .populate("buyer")
      .exec();

    // Filter orders based on seller's ID
    res = orders.filter(order => {
      if (order.cow instanceof mongoose.Types.ObjectId) {
        return false; // Skip orders with ObjectId, you're interested in ICow
      }

      // Now you know order.cow is of type ICow
      return order.cow.seller._id?.toString() === userInfo.id;
    });
  }
  if (!res) {
    throw new ApiError("Order not found", httpStatus.NOT_FOUND);
  }
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
