import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import {
  deleteUserService,
  getAllUserService,
  userStatusChangeService,
} from "./user.service";

// get all Users
export const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await getAllUserService(req.query);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Users fetched successfully",
    pagination: result.meta,
    data: result.data,
  });
});

// Update an existing user
export const userStatusChange = catchAsync(
  async (req: Request, res: Response) => {
    const { ...userData } = req.body;

    const result = await userStatusChangeService(userData);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "User status updated successfully",
      data: result,
    });
  },
);

// Delete an existing User
export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;

  await deleteUserService(userId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "User deleted successfully",
  });
});
