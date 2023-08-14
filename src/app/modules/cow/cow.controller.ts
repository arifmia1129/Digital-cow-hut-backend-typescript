import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import {
  Pagination,
  Filter,
} from "../../../interfaces/databaseQuery.interface";
import pick from "../../../shared/pick";
import { paginationField } from "../../constant/pagination";
import * as cowService from "./cow.service";
import httpStatus from "../../../shared/httpStatus";
import { cowFilterableField } from "./cow.constant";
import { ICow } from "./cow.interface";
import ApiError from "../../../errors/ApiError";

export const createCow = catchAsync(async (req: Request, res: Response) => {
  const result = await cowService.createCowService(req.body);

  sendResponse<ICow>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Successfully created cow",
    data: result,
  });
});

export const getCow = catchAsync(async (req: Request, res: Response) => {
  const filterData: Filter = pick(req.query, cowFilterableField);
  const paginationOptions: Pagination = pick(req.query, paginationField);

  const result = await cowService.getCowService(filterData, paginationOptions);

  sendResponse<ICow[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Successfully get Cow",
    meta: result.meta,
    data: result.data,
  });
});

export const getCowById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await cowService.getCowByIdService(id);
  sendResponse<ICow>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Successfully get Cow by id",
    data: result,
  });
});

export const updateCowById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Check if req.user exists and has the 'id' property
  if (!req.user || !("id" in req.user)) {
    // Handle the case where user information is missing
    throw new ApiError("Missing seller id", httpStatus.BAD_REQUEST);
  }
  const { id: sellerId } = req.user;

  const result = await cowService.updateCowByIdService(id, sellerId, req.body);
  sendResponse<ICow>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Successfully updated Cow",
    data: result,
  });
});

export const deleteCowById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Check if req.user exists and has the 'id' property
  if (!req.user || !("id" in req.user)) {
    // Handle the case where user information is missing
    throw new ApiError("Missing seller id", httpStatus.BAD_REQUEST);
  }
  const { id: sellerId } = req.user;

  const result = await cowService.deleteCowByIdService(id, sellerId);
  sendResponse<ICow>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Successfully deleted Cow",
    data: result,
  });
});
