import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Pagination } from "../../../interfaces/databaseQuery.interface";
import pick from "../../../shared/pick";
import { paginationField } from "../../constant/pagination";
import * as orderService from "./order.service";
import httpStatus from "../../../shared/httpStatus";
import { IOrder } from "./order.interface";
import { JwtPayload } from "jsonwebtoken";
export const createOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await orderService.createOrderService(req.body);

  sendResponse<IOrder>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Successfully created Order",
    data: result,
  });
});

export const getOrder = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions: Pagination = pick(req.query, paginationField);

  const result = await orderService.getOrderService(
    paginationOptions,
    req.user as JwtPayload,
  );

  sendResponse<IOrder | IOrder[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Successfully get Order",
    meta: result.meta,
    data: result.data,
  });
});

export const getOrderById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await orderService.getOrderByIdService(
    id,
    req.user as JwtPayload,
  );

  sendResponse<IOrder>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Successfully get Order",
    data: result,
  });
});
