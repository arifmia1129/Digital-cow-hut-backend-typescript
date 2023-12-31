import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import {
  Pagination,
  Filter,
} from "../../../interfaces/databaseQuery.interface";
import pick from "../../../shared/pick";
import { paginationField } from "../../constant/pagination";
import * as userService from "./user.service";
import { userFilterableField } from "./user.constant";
import { IUser } from "./user.interface";
import httpStatus from "../../../shared/httpStatus";
import { JwtPayload } from "jsonwebtoken";
import { IAdmin } from "../admin/admin.interface";

export const getUser = catchAsync(async (req: Request, res: Response) => {
  const filterData: Filter = pick(req.query, userFilterableField);
  const paginationOptions: Pagination = pick(req.query, paginationField);

  const result = await userService.getUserService(
    filterData,
    paginationOptions,
  );

  sendResponse<IUser[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Successfully get User",
    meta: result.meta,
    data: result.data,
  });
});

export const getUserById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await userService.getUserByIdService(id);
  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Successfully get User by id",
    data: result,
  });
});

export const getUserProfileByToken = catchAsync(
  async (req: Request, res: Response) => {
    const result = await userService.getUserProfileByTokenService(
      req.user as JwtPayload,
    );
    sendResponse<IUser | IAdmin>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully retrieved user profile data",
      data: result,
    });
  },
);

export const updateUserById = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await userService.updateUserByIdService(id, req.body);
    sendResponse<IUser>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully updated User",
      data: result,
    });
  },
);
export const updateUserProfileByToken = catchAsync(
  async (req: Request, res: Response) => {
    const result = await userService.updateUserProfileByTokenService(
      req.user as JwtPayload,
      req.body,
    );
    sendResponse<IUser | IAdmin>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully updated user profile data",
      data: result,
    });
  },
);

export const deleteUserById = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await userService.deleteUserByIdService(id);
    sendResponse<IUser>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully deleted User",
      data: result,
    });
  },
);
