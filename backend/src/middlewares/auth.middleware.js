import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

// verify jwt token
export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    // console.log("verifyJWT-->", token);
    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

// verify admin
export const verifyAdmin = asyncHandler(async (req, res, next) => {
  const user = req.user;

  console.log("verifyAdmin-->", user.role);
  if (!user || user.role !== "Admin") {
    return next(new ApiError(403, "Access denied: Admin privileges required"));
  }

  next();
});

// verify Account Person
export const verifyAccountPerson = asyncHandler(async (req, res, next) => {
  const user = req.user;

  if (!user || (user.role !== "Account" && user.role !== "Admin")) {
    return next(
      new ApiError(403, "Access denied: Account Person privileges required")
    );
  }
  next();
});
