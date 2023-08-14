import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import * as adminService from "./admin.service";
import httpStatus from "../../../shared/httpStatus";
import { IAdmin } from "./admin.interface";

export const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.createAdminService(req.body);

  sendResponse<IAdmin>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Successfully created admin",
    data: result,
  });
});
