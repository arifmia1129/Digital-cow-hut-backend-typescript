import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import * as authService from "../auth/auth.service";
import { IUser } from "../user/user.interface";
import httpStatus from "../../../shared/httpStatus";

export const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.createUserService(req.body);

  sendResponse<IUser>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Successfully created user",
    data: result,
  });
});
