import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"; 
import { ApiResponse } from "../utils/ApiResponse.js"; 
import User from "../models/user.model.js";
import { roles } from "../constants";

// Update User Role Controller
export const updateUserRole = asyncHandler(async (req, res, next) => {
  const admin = req.user;
  const userId = req.params.userId;
  const { role } = req.body;

  if (admin?.role !== "Admin") {
    return next(new ApiError(403, "Access denied: Admin privileges required"));
  }

  if (!userId || !role) {
    return next(new ApiError(400, "User ID and role are required"));
  }

  const validRoles = roles;
  if (!validRoles.includes(role)) {
    return next(new ApiError(400, "Invalid role provided"));
  }

  const user = await User.findById(userId);
  if (!user) {
    return next(new ApiError(404, "User not found"));
  }

  user.role = role;
  await user.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, user, `User role updated to ${role} successfully`)
    );
});
