import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Utility function to convert URL to HTTPS
const ensureHttpsUrl = (url) => {
  if (url && url.startsWith("http://")) {
    return url.replace(/^http:\/\//i, "https://");
  }
  return url;
};

// Single image upload from memory buffer
const uploadOnCloudinary = async (fileBuffer) => {
  try {
    if (!fileBuffer) return null;

    // Return a promise to handle the async nature of upload_stream
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "auto" },
        (error, result) => {
          if (error) {
            reject("Error uploading to Cloudinary: " + error);
          } else {
            resolve(result);
          }
        }
      );

      // Pass the buffer to the upload stream
      uploadStream.end(fileBuffer);
    });

    // Modify the response URL to ensure it's HTTPS
    const secureUrl = ensureHttpsUrl(result.url);

    console.log("File uploaded to Cloudinary:", secureUrl);

    // Return the result with the secure URL
    return { ...result, url: secureUrl };
  } catch (error) {
    console.log("Error from Cloudinary:", error);
    return null;
  }
};

// Multiple image upload from memory buffers
const multiUploadOnCloudinary = async (fileBuffers) => {
  try {
    const uploadPromises = fileBuffers.slice(0, 5).map(async (buffer) => {
      const result = await uploadOnCloudinary(buffer);
      return result ? result.url : null;
    });

    // Wait for all uploads to complete
    const uploadResults = await Promise.all(uploadPromises);

    // Filter out null values (failed uploads)
    return uploadResults.filter((url) => url !== null);
  } catch (error) {
    console.log("Error uploading multiple files to Cloudinary:", error);
    return [];
  }
};

// delete images from cloudinary
const deleteImagesFromCloudinary = async (imageUrls) => {
  try {
    // Extract public IDs from image URLs
    const publicIds = imageUrls.map((url) => {
      const splitUrl = url.split("/");
      const fileNameWithExtension = splitUrl[splitUrl.length - 1]; // e.g., "xiqijkbampstujuicud6.jpg"
      return fileNameWithExtension.split(".")[0]; // Extract public ID, e.g., "xiqijkbampstujuicud6"
    });

    console.log("Public IDs to delete:", publicIds);

    // Delete images from Cloudinary
    const deleteResults = await Promise.all(
      publicIds.map((publicId) => cloudinary.uploader.destroy(publicId))
    );

    // console.log("Delete Results:", deleteResults);
    return deleteResults;
  } catch (error) {
    console.error("Error deleting images:", error);
    return [];
  }
};

export {
  uploadOnCloudinary,
  multiUploadOnCloudinary,
  deleteImagesFromCloudinary,
};
