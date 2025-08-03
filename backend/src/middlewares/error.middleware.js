import { ApiError } from "../utils/ApiError.js";

export const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server error !!";

  // for mongodb wrong id farmate
  if (err.name === "CastError") {
    const message = "Resorce not found !!";
    err = new ApiError(400, message);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    error: err,
  });
};
