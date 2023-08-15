import { NextFunction, Request, Response } from "express";
import ApiError from "../../errors/ApiError";
import httpStatus from "../../shared/httpStatus";
import { verifyAndDecodeToken } from "../../helpers/jwtHelper";
import config from "../../config";
import { Secret } from "jsonwebtoken";
import User from "../modules/user/user.model";
import Admin from "../modules/admin/admin.model";

const auth = (...authorizedRole: Array<string>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      // check token given or not
      if (!token) {
        throw new ApiError("You are unauthorized", httpStatus.UNAUTHORIZED);
      }

      const verifiedUser = verifyAndDecodeToken(
        token,
        config.jwt.secret as Secret,
      );

      if (verifiedUser.role === "buyer" || verifiedUser.role === "seller") {
        const isUserExist = await User.findById(verifiedUser.id);

        if (!isUserExist) {
          throw new ApiError(
            "You are not exist right now",
            httpStatus.FORBIDDEN,
          );
        }
      }

      if (verifiedUser.role === "admin") {
        const isAdminExist = await Admin.findById(verifiedUser.id);

        if (!isAdminExist) {
          throw new ApiError(
            "You are not exist right now",
            httpStatus.FORBIDDEN,
          );
        }
      }

      if (!authorizedRole.includes(verifiedUser.role)) {
        throw new ApiError(
          "You are not authorized to access this future",
          httpStatus.FORBIDDEN,
        );
      }

      req.user = verifiedUser;

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
