/* eslint-disable @typescript-eslint/no-explicit-any */
import ApiError from "../../../errors/ApiError";
import httpStatus from "../../../shared/httpStatus";
import {
  IAdmin,
  LoginCredential,
  LoginResponse,
  RefreshToken,
} from "./admin.interface";
import Admin from "./admin.model";
import * as jwtHelper from "../../../helpers/jwtHelper";
import config from "../../../config";
import { Secret } from "jsonwebtoken";

export const createAdminService = async (admin: IAdmin): Promise<IAdmin> => {
  const res = await Admin.create(admin);

  if (!res) {
    throw new ApiError(
      "Failed to create Admin to database",
      httpStatus.BAD_REQUEST,
    );
  }

  return res;
};

export const loginAdminService = async (
  payload: LoginCredential,
): Promise<LoginResponse> => {
  const { phoneNumber, password } = payload;

  const isAdminExist = await Admin.isAdminExist(phoneNumber);

  if (!isAdminExist) {
    throw new ApiError(
      "Admin not found by given phone number",
      httpStatus.NOT_FOUND,
    );
  }

  if (!isAdminExist?.password) {
    throw new ApiError("Invalid Admin information.", httpStatus.BAD_REQUEST);
  }

  const isPasswordMatched = await Admin.isPasswordMatched(
    password,
    isAdminExist.password,
  );

  if (!isPasswordMatched) {
    throw new ApiError("Invalid ID or Password", httpStatus.FORBIDDEN);
  }

  const { _id, role } = isAdminExist;

  const accessToken = jwtHelper.createToken(
    { adminId: _id, role },
    config.jwt.secret as Secret,
    config.jwt.secret_expires_in as string,
  );

  const refreshToken = jwtHelper.createToken(
    { adminId: _id, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_secret_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const refreshTokenAdminService = async (
  token: string,
): Promise<RefreshToken> => {
  const verifiedToken = jwtHelper.verifyAndDecodeToken(
    token,
    config.jwt.refresh_secret as Secret,
  );

  const { adminId, role } = verifiedToken;

  const isAdminExist = await Admin.findById(adminId);

  if (!isAdminExist) {
    throw new ApiError("Admin does not exist", httpStatus.FORBIDDEN);
  }

  if (!isAdminExist?.password) {
    throw new ApiError("Invalid Admin information.", httpStatus.BAD_REQUEST);
  }

  if (isAdminExist.role !== role) {
    throw new ApiError("Admin role is mismatched", httpStatus.FORBIDDEN);
  }

  const accessToken = jwtHelper.createToken(
    { adminId, role },
    config.jwt.secret as Secret,
    config.jwt.secret_expires_in as string,
  );

  return {
    accessToken,
  };
};
