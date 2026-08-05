import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiError";
import { dbClient } from "../../../lib/prisma";
import unlinkFile from "../../../shared/unlinkFile";
import { Prisma } from "../../../../generated/prisma/client";
import { IQuery } from "../../../types/company";

// get all User
export const getAllUserService = async (query: IQuery) => {
  // Pagination
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(500, Math.max(1, Number(query.limit) || 10));
  const skip = (page - 1) * limit;

  const andConditions: Prisma.UserWhereInput[] = [];

  // User search (name, email, phone)
  if (query.search) {
    andConditions.push({
      OR: [
        {
          name: {
            contains: query.search,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: query.search,
            mode: "insensitive",
          },
        },
        {
          phone: {
            contains: query.search,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  // status filter
  if (query.status) {
    andConditions.push({
      status: query.status as any,
    });
  } else {
    // exclude DELETED by default
    andConditions.push({
      NOT: {
        status: "DELETED",
      },
    });
  }

  const whereCondition: Prisma.UserWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  // Fetch users & total count in parallel
  const [users, total] = await Promise.all([
    dbClient.user.findMany({
      where: whereCondition,
      skip,
      take: limit,
      orderBy: {
        id: "desc",
      },
      omit: {
        password: true,
      },
    }),

    dbClient.user.count({
      where: whereCondition,
    }),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },

    data: users,
  };
};

// Status change
export const userStatusChangeService = async (payload: any) => {
  const { id, status } = payload;

  // check User exist
  const isExistUser = await dbClient.user.findUnique({
    where: { id: id },
  });

  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  // update User
  const result = await dbClient.user.update({
    where: { id: id },
    data: {
      status: status,
    },
    omit: {
      password: true,
    },
  });

  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to Status change!");
  }

  return result;
};

// Delete an existing User
export const deleteUserService = async (userId: any) => {
  // check user exist
  const isExistUser = await dbClient.user.findUnique({
    where: { id: userId },
  });
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  // delete image
  if (isExistUser.profile) {
    unlinkFile(isExistUser.profile);
  }

  // delete User
  const result = await dbClient.user.delete({
    where: { id: userId },
  });

  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to delete User!");
  }
};
