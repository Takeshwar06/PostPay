import multer from "multer";
import { ApiError } from "../utils/ApiError.js";

// Use memory storage instead of disk storage
const storage = multer.memoryStorage();

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true); 
  } else {
    cb(new ApiError(409, "Only image files are allowed!"), false); 
  }
};

// Configure multer with memory storage
export const upload = multer({
  storage,
  fileFilter,
});
