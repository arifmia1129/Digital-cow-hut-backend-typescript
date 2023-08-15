/* eslint-disable @typescript-eslint/no-explicit-any */
import { SortOrder } from "mongoose";
import { paginationHelper } from "../../../helpers/paginationHelper";
import {
  Filter,
  Pagination,
  ResponseWithPagination,
} from "../../../interfaces/databaseQuery.interface";
import { IUser, Name } from "./user.interface";
import User from "./user.model";
import { userSearchableField } from "./user.constant";
import ApiError from "../../../errors/ApiError";
import httpStatus from "../../../shared/httpStatus";
import { JwtPayload } from "jsonwebtoken";
import { IAdmin } from "../admin/admin.interface";
import bcrypt from "bcryptjs";
import config from "../../../config";

export const getUserService = async (
  filters: Filter,
  paginationOptions: Pagination,
): Promise<ResponseWithPagination<IUser[]>> => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

  const sortCondition: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortCondition[sortBy] = sortOrder;
  }

  const { searchTerm, ...filtersData } = filters;

  const andCondition = [];

  if (searchTerm) {
    andCondition.push({
      $or: userSearchableField.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andCondition.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const whereConditions = andCondition.length ? { $and: andCondition } : {};

  const res = await User.find(whereConditions)
    .sort(sortCondition)
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: res,
  };
};

export const getUserByIdService = async (id: string): Promise<IUser | null> => {
  const res = await User.findById(id);

  if (!res) {
    throw new ApiError(
      "Failed to retrieve user by given ID",
      httpStatus.BAD_REQUEST,
    );
  }

  return res;
};

export const getUserProfileByTokenService = async (
  payload: JwtPayload,
): Promise<IUser | IAdmin> => {
  const { id } = payload;

  const res = await User.findById(id);

  if (!res) {
    throw new ApiError("User profile not found", httpStatus.NOT_FOUND);
  }

  return res;
};

export const updateUserProfileByTokenService = async (
  userPayload: JwtPayload,
  updatePayload: Partial<IUser>,
): Promise<IUser | IAdmin> => {
  const { id } = userPayload;

  const { name, password, ...userInfo } = updatePayload;

  const updateInfo: Partial<IUser> = { ...userInfo };

  //   name object
  if (name && Object.keys(name).length > 0) {
    const nameKeys = Object.keys(name);
    nameKeys.forEach(key => {
      const nameKey = `name.${key}`;
      (updateInfo as any)[nameKey] = name[key as keyof Name];
    });
  }

  // password
  if (password) {
    const hashedPassword = await bcrypt.hash(
      password,
      Number(config.bcrypt_salt_rounds),
    );

    updateInfo.password = hashedPassword;
  }

  const res = await User.findOneAndUpdate({ _id: id }, updateInfo, {
    new: true,
  });

  if (!res) {
    throw new ApiError(
      "Couldn't update user profile information",
      httpStatus.NOT_FOUND,
    );
  }

  return res;
};

export const updateUserByIdService = async (
  id: string,
  payload: Partial<IUser>,
): Promise<IUser | null> => {
  const isExist = await User.findById(id);

  if (!isExist) {
    throw new ApiError("User not found by given id", httpStatus.NOT_FOUND);
  }

  const { name, ...userInfo } = payload;

  const updateInfo: Partial<IUser> = { ...userInfo };

  //   name object
  if (name && Object.keys(name).length > 0) {
    const nameKeys = Object.keys(name);
    nameKeys.forEach(key => {
      const nameKey = `name.${key}`;
      (updateInfo as any)[nameKey] = name[key as keyof Name];
    });
  }

  const res = await User.findOneAndUpdate({ _id: id }, updateInfo, {
    new: true,
  });

  return res;
};

export const deleteUserByIdService = async (
  id: string,
): Promise<IUser | null> => {
  const res = await User.findByIdAndDelete(id);
  return res;
};
