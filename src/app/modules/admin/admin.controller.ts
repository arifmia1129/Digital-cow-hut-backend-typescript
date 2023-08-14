/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import * as adminService from "./admin.service";
import httpStatus from "../../../shared/httpStatus";
import { IAdmin, LoginResponse, RefreshToken } from "./admin.interface";
import ApiError from "../../../errors/ApiError";
import { Document } from "mongoose";
import config from "../../../config";

export const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.createAdminService(req.body);

  if (result instanceof Document) {
    const { password, ...other } = result.toObject();

    sendResponse<Pick<IAdmin, "phoneNumber" | "role" | "name" | "address">>(
      res,
      {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Successfully created admin",
        data: other,
      },
    );
  } else {
    throw new ApiError("Failed to create admin", httpStatus.BAD_REQUEST);
  }
});

export const loginAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.loginAdminService(req.body);

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

export const refreshTokenAdmin = catchAsync(
  async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;

    const result = await adminService.refreshTokenAdminService(refreshToken);

    sendResponse<RefreshToken>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Refresh token process done successfully",
      data: result,
    });
  },
);
