import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { deleteUser, getAllUsers, userStatusChange } from "./user.controller";
import { adminAuth } from "../../middlewares/auth";
import { getUserZodSchema, updateUserStatusZodSchema } from "./user.validation";

const router = express.Router();

router.get("/", adminAuth(), validateRequest(getUserZodSchema), getAllUsers);

router.patch(
  "/update-status",
  adminAuth(),
  validateRequest(updateUserStatusZodSchema),
  userStatusChange,
);
router.delete("/:id", adminAuth(), deleteUser);

export const UserRoutes = router;
