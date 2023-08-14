/* eslint-disable @typescript-eslint/no-explicit-any */
import ApiError from "../../../errors/ApiError";
import httpStatus from "../../../shared/httpStatus";
import { IAdmin } from "./admin.interface";
import Admin from "./admin.model";

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

// export const getAdminService = async (
//   filters: Filter,
//   paginationOptions: Pagination,
// ): Promise<ResponseWithPagination<IAdmin[]>> => {
//   const { page, limit, skip, sortBy, sortOrder } =
//     paginationHelper.calculatePagination(paginationOptions);

//   const sortCondition: { [key: string]: SortOrder } = {};

//   if (sortBy && sortOrder) {
//     sortCondition[sortBy] = sortOrder;
//   }

//   const { searchTerm, ...filtersData } = filters;

//   const andCondition = [];

//   if (searchTerm) {
//     andCondition.push({
//       $or: adminSearchableField.map(field => ({
//         [field]: {
//           $regex: searchTerm,
//           $options: "i",
//         },
//       })),
//     });
//   }

//   if (Object.keys(filtersData).length) {
//     andCondition.push({
//       $and: Object.entries(filtersData).map(([field, value]) => ({
//         [field]: value,
//       })),
//     });
//   }

//   const whereConditions = andCondition.length ? { $and: andCondition } : {};

//   const res = await Admin.find(whereConditions)
//     .sort(sortCondition)
//     .skip(skip)
//     .limit(limit);

//   const total = await Admin.countDocuments(whereConditions);

//   return {
//     meta: {
//       page,
//       limit,
//       total,
//     },
//     data: res,
//   };
// };

// export const getAdminByIdService = async (
//   id: string,
// ): Promise<IAdmin | null> => {
//   const res = await Admin.findById(id);

//   if (!res) {
//     throw new ApiError(
//       "Failed to retrieve Admin by given ID",
//       httpStatus.BAD_REQUEST,
//     );
//   }

//   return res;
// };

// export const updateAdminByIdService = async (
//   id: string,
//   payload: Partial<IAdmin>,
// ): Promise<IAdmin | null> => {
//   const isExist = await Admin.findById(id);

//   if (!isExist) {
//     throw new ApiError("Admin not found by given id", httpStatus.NOT_FOUND);
//   }

//   const { name, ...AdminInfo } = payload;

//   const updateInfo: Partial<IAdmin> = { ...AdminInfo };

//   //   name object
//   if (name && Object.keys(name).length > 0) {
//     const nameKeys = Object.keys(name);
//     nameKeys.forEach(key => {
//       const nameKey = `name.${key}`;
//       (updateInfo as any)[nameKey] = name[key as keyof Name];
//     });
//   }

//   const res = await Admin.findOneAndUpdate({ _id: id }, updateInfo, {
//     new: true,
//   });

//   return res;
// };

// export const deleteAdminByIdService = async (
//   id: string,
// ): Promise<IAdmin | null> => {
//   const res = await Admin.findByIdAndDelete(id);
//   return res;
// };
