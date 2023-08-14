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
      message: "Successfully created admin",
      data: other,
    });
  } else {
    throw new ApiError("Failed to create admin", httpStatus.BAD_REQUEST);
  }
});
