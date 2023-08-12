import ApiError from "../../../errors/ApiError";
import User from "../user/user.model";
import { IUser } from "../user/user.interface";
import httpStatus from "../../../shared/httpStatus";

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
