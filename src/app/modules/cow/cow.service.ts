/* eslint-disable @typescript-eslint/no-explicit-any */
import { SortOrder } from "mongoose";
import { paginationHelper } from "../../../helpers/paginationHelper";
import {
  Filter,
  Pagination,
  ResponseWithPagination,
} from "../../../interfaces/databaseQuery.interface";
import ApiError from "../../../errors/ApiError";
import httpStatus from "../../../shared/httpStatus";
import { ICow } from "./cow.interface";
import Cow from "./cow.model";
import { cowSearchableField } from "./cow.constant";
import User from "../user/user.model";

export const createCowService = async (cow: ICow): Promise<ICow | null> => {
  const isUserExist = await User.findById(cow.seller);

  if (!isUserExist) {
    throw new ApiError("Seller not found by given id", httpStatus.BAD_REQUEST);
  }

  const res = await Cow.create(cow);

  if (!res) {
    throw new ApiError(
      "Failed to create cow to database",
      httpStatus.BAD_REQUEST,
    );
  }

  return res;
};

export const getCowService = async (
  filters: Filter,
  paginationOptions: Pagination,
): Promise<ResponseWithPagination<ICow[]>> => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

  const sortCondition: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortCondition[sortBy] = sortOrder;
  }

  const { searchTerm, minPrice, maxPrice, ...filtersData } = filters;

  const andCondition = [];

  if (searchTerm) {
    andCondition.push({
      $or: cowSearchableField.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andCondition.push({
      $and: Object.entries(filtersData).map(([field, value]) => {
        if (typeof value === "string") {
          return {
            [field]: {
              $regex: value,
              $options: "i", // This makes the search case-insensitive
            },
          };
        }
        return { [field]: value };
      }),
    });
  }

  if (minPrice) {
    andCondition.push({
      price: { $gt: Number(minPrice) },
    });
  }
  if (maxPrice) {
    andCondition.push({
      price: { $lt: Number(maxPrice) },
    });
  }

  const whereConditions = andCondition.length ? { $and: andCondition } : {};

  const res = await Cow.find(whereConditions)
    .populate("seller")
    .sort(sortCondition)
    .skip(skip)
    .limit(limit);

  const total = await Cow.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: res,
  };
};

export const getCowByIdService = async (id: string): Promise<ICow | null> => {
  const res = await Cow.findById(id).populate("seller");

  if (!res) {
    throw new ApiError(
      "Failed to retrieve Cow by given ID",
      httpStatus.BAD_REQUEST,
    );
  }

  return res;
};

export const updateCowByIdService = async (
  id: string,
  sellerId: string,
  payload: Partial<ICow>,
): Promise<ICow | null> => {
  const isExist = await Cow.findById(id);

  if (!isExist) {
    throw new ApiError("Cow not found by given id", httpStatus.NOT_FOUND);
  }

  if (isExist.seller.toString() !== sellerId) {
    throw new ApiError("You can update only your own cow information", 403);
  }

  const res = await Cow.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  }).populate("seller");

  return res;
};

export const deleteCowByIdService = async (
  id: string,
  sellerId: string,
): Promise<ICow | null> => {
  const isExist = await Cow.findById(id);

  if (!isExist) {
    throw new ApiError("Cow not found by given id", httpStatus.NOT_FOUND);
  }

  if (isExist.seller.toString() !== sellerId) {
    throw new ApiError("You can delete only your own cow information", 403);
  }

  const res = await Cow.findByIdAndDelete(id);
  return res;
};
