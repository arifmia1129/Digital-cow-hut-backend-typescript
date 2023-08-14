import ApiError from "../../../errors/ApiError";
import User from "../user/user.model";
import { IUser } from "../user/user.interface";
import httpStatus from "../../../shared/httpStatus";
import config from "../../../config";
import {
  LoginCredential,
  LoginResponse,
  RefreshToken,
} from "../admin/admin.interface";
import * as jwtHelper from "../../../helpers/jwtHelper";
import { Secret } from "jsonwebtoken";

export const createUserService = async (user: IUser): Promise<IUser | null> => {
  const res = await User.create(user);

  if (!res) {
    throw new ApiError(
      "Failed to create user to database",
      httpStatus.BAD_REQUEST,
    );
  }

  return res;
};

export const loginAuthService = async (
  payload: LoginCredential,
): Promise<LoginResponse> => {
  const { phoneNumber, password } = payload;

  const user = new User();

  const isUserExist = await user.isUserExist(phoneNumber);

  if (!isUserExist) {
    throw new ApiError(
      "User not found by given phone number",
      httpStatus.NOT_FOUND,
    );
  }

  if (!isUserExist?.password) {
    throw new ApiError("Invalid user information.", httpStatus.BAD_REQUEST);
  }

  const isPasswordMatched = await user.isPasswordMatched(
    password,
    isUserExist.password,
  );

  if (!isPasswordMatched) {
    throw new ApiError("Invalid ID or Password", httpStatus.FORBIDDEN);
  }

  const { _id, role } = isUserExist;

  const accessToken = jwtHelper.createToken(
    { id: _id, role },
    config.jwt.secret as Secret,
    config.jwt.secret_expires_in as string,
  );

  const refreshToken = jwtHelper.createToken(
    { id: _id, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_secret_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const refreshTokenAuthService = async (
  token: string,
): Promise<RefreshToken> => {
  const verifiedToken = jwtHelper.verifyAndDecodeToken(
    token,
    config.jwt.refresh_secret as Secret,
  );

  const { id, role } = verifiedToken;

  let isUserExist;

  isUserExist = await User.findById(id);

  if (!isUserExist) {
    throw new ApiError("User does not exist", httpStatus.FORBIDDEN);
  }

  const user = new User();

  isUserExist = await user.isUserExist(isUserExist.phoneNumber);

  if (!isUserExist) {
    throw new ApiError("User does not exist", httpStatus.FORBIDDEN);
  }

  if (!isUserExist?.password) {
    throw new ApiError("Invalid user information.", httpStatus.BAD_REQUEST);
  }

  if (isUserExist.role !== role) {
    throw new ApiError("User role is mismatched", httpStatus.FORBIDDEN);
  }

  const accessToken = jwtHelper.createToken(
    { id, role },
    config.jwt.secret as Secret,
    config.jwt.secret_expires_in as string,
  );

  return {
    accessToken,
  };
};
