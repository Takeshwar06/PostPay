import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import User from "../models/user.model.js";
import { roles } from "../constants.js";
import jwt from "jsonwebtoken";
// method for generate access and refresh token
const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};

// user register controller
export const userRegister = asyncHandler(async (req, res, next) => {
  const { phone, password, name, email } = req.body;
  console.log(phone, password, name, email);
  if (!phone) {
    return next(new ApiError(400, "Mobile number is required"));
  }
  if (!password) {
    return next(new ApiError(400, "Password is required"));
  }
  if (phone?.lenght < 10) {
    return next(new ApiError(400, "Mobile number should be 10 digits"));
  }
  if (password.length < 6) {
    return next(new ApiError(400, "Password should be at least 6 characters"));
  }
  const user = await User.findOne({ phone });
  if (user) {
    return next(new ApiError(400, "User already exists! Please login"));
  }
  const newUser = await User.create({
    phone,
    password,
    name,
    email,
  });
  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    newUser._id
  );
  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        { user: newUser, accessToken, refreshToken },
        "User registered Successfully"
      )
    );
});

// user login controller
export const userLogin = asyncHandler(async (req, res, next) => {
  const { phone, password } = req.body;
  if (!phone) {
    return next(new ApiError(400, "Mobile number is required"));
  }
  if (!password) {
    return next(new ApiError(400, "Password is required"));
  }
  const user = await User.findOne({ phone });
  if (!user) {
    return next(new ApiError(404, "User not found! create An acount"));
  }
  if (user.role !== "User") {
    return next(new ApiError(400, "Invalid User credintials!"));
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    return next(new ApiError(401, "Invalid User credintials!"));
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );
  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        { user, accessToken, refreshToken },
        "User logged in Successfully"
      )
    );
});

// Admin register controller
export const adminRegister = asyncHandler(async (req, res, next) => {
  const { phone, password } = req.body;
  if (!phone) {
    return next(new ApiError(400, "Mobile number is required"));
  }
  if (!password) {
    return next(new ApiError(400, "Password is required"));
  }
  if (phone?.lenght < 10) {
    return next(new ApiError(400, "Mobile number should be 10 digits"));
  }
  if (password.length < 6) {
    return next(new ApiError(400, "Password should be at least 6 characters"));
  }
  const user = await User.findOne({ phone })?.select("-password -refreshToken");
  if (!user) {
    return next(
      new ApiError(404, "User not found! first create Acount as an User")
    );
  }
  if (user.role !== "Admin") {
    return next(new ApiError(400, "Invalid Admin creditials!"));
  }

  user.password = password;
  await user.save();
  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );
  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        { user, accessToken, refreshToken },
        "Admin registered Successfully"
      )
    );
});

// Admin login controller
export const adminLogin = asyncHandler(async (req, res, next) => {
  const { phone, password } = req.body;
  if (!phone) {
    return next(new ApiError(400, "Mobile number is required"));
  }
  if (!password) {
    return next(new ApiError(400, "Password is required"));
  }
  const user = await User.findOne({ phone });
  if (!user) {
    return next(new ApiError(404, "User not found! create An acount"));
  }
  if (user.role !== "Admin") {
    return next(new ApiError(400, "Invalid Admin credintials!"));
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    return next(new ApiError(401, "Invalid Admin credintials!"));
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );
  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        { user, accessToken, refreshToken },
        "Admin login Successfully"
      )
    );
});

// Account person register controller
export const accountPersonRegister = asyncHandler(async (req, res, next) => {
  const { phone, password } = req.body;
  if (!phone) {
    return next(new ApiError(400, "Mobile number is required"));
  }
  if (!password) {
    return next(new ApiError(400, "Password is required"));
  }
  if (phone?.lenght < 10) {
    return next(new ApiError(400, "Mobile number should be 10 digits"));
  }
  if (password.length < 6) {
    return next(new ApiError(400, "Password should be at least 6 characters"));
  }
  const user = await User.findOne({ phone })?.select("-password -refreshToken");
  if (!user) {
    return next(
      new ApiError(404, "User not found! first create Acount in SitePe")
    );
  }
  if (user.role !== "Account") {
    return next(new ApiError(400, "Invalid Account person creditials!"));
  }

  user.password = password;
  await user.save();
  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );
  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        { user, accessToken, refreshToken },
        "Account person registered Successfully"
      )
    );
});

// Account person login controller
export const accountPersonLogin = asyncHandler(async (req, res, next) => {
  const { phone, password } = req.body;
  if (!phone) {
    return next(new ApiError(400, "Mobile number is required"));
  }
  if (!password) {
    return next(new ApiError(400, "Password is required"));
  }
  const user = await User.findOne({ phone });
  if (!user) {
    return next(new ApiError(404, "User not found! create An acount"));
  }
  if (user.role !== "Account") {
    return next(new ApiError(400, "Invalid Account person credintials!"));
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    return next(new ApiError(401, "Invalid Account person credintials!"));
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );
  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        { user, accessToken, refreshToken },
        "Account person login Successfully"
      )
    );
});

// refresh the access token controller
export const refreshAccessToken = asyncHandler(async (req, res, next) => {
  const incomingRefreshToken = req.body.refreshToken;

  console.log("refresh token called");
  if (!incomingRefreshToken) {
    return next(new ApiError(401, "unauthorized request"));
  }

  const decodedToken = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  const user = await User.findById(decodedToken?._id);

  if (!user) {
    return next(new ApiError(401, "Invalid refresh token"));
  }

  if (incomingRefreshToken !== user?.refreshToken) {
    return next(new ApiError(401, "Refresh token is expired or used"));
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken },
        "Access token refreshed"
      )
    );
});
