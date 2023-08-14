/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import * as authService from "../auth/auth.service";
import { IUser } from "../user/user.interface";
import httpStatus from "../../../shared/httpStatus";
import { Document } from "mongoose";
import ApiError from "../../../errors/ApiError";
import config from "../../../config";
import { LoginResponse, RefreshToken } from "../admin/admin.interface";

export const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.createUserService(req.body);

  if (result instanceof Document) {
    const { password, ...other } = result.toObject();

    sendResponse<
      Pick<
        IUser,
        "phoneNumber" | "role" | "name" | "address" | "budget" | "income"
      >
    >(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Successfully created user",
      data: other,
    });
  } else {
    throw new ApiError("Failed to create user", httpStatus.BAD_REQUEST);
  }
});

export const loginAuth = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.loginAuthService(req.body);

  const { refreshToken, ...other } = result;

  // set refresh token to cookie
  const cookieOption = {
    secret: config.env === "production",
    httpOnly: true,
  };

  res.cookie("refreshToken", refreshToken, cookieOption);

  sendResponse<LoginResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Log in process done successfully",
    data: other,
  });
});

export const refreshTokenAuth = catchAsync(
  async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;

    const result = await authService.refreshTokenAuthService(refreshToken);

    sendResponse<RefreshToken>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Refresh token process done successfully",
      data: result,
    });
  },
);
