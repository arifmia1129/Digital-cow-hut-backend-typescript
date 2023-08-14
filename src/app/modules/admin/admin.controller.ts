/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import * as adminService from "./admin.service";
import httpStatus from "../../../shared/httpStatus";
import { IAdmin } from "./admin.interface";
import ApiError from "../../../errors/ApiError";
import { Document } from "mongoose";

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
