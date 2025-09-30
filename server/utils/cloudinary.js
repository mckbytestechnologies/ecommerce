import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload file to Cloudinary
 * @param {string} filePath - Local file path
 * @param {string} folder - Cloudinary folder
 * @returns {Promise<Object>} Cloudinary upload result
 */
export const cloudinaryUpload = async (filePath, folder = "ecommerce") => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: `ecommerce/${folder}`,
      resource_type: "auto",
    });

    // Delete local file after upload
    fs.unlinkSync(filePath);

    return result;
  } catch (error) {
    // Delete local file if upload fails
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

/**
 * Delete file from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<Object>} Cloudinary delete result
 */
export const cloudinaryDelete = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error(`Cloudinary delete failed: ${error.message}`);
  }
};

/**
 * Upload multiple files to Cloudinary
 * @param {Array} files - Array of file paths
 * @param {string} folder - Cloudinary folder
 * @returns {Promise<Array>} Array of upload results
 */
export const cloudinaryUploadMultiple = async (files, folder = "ecommerce") => {
  try {
    const uploadPromises = files.map(file => cloudinaryUpload(file, folder));
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    throw new Error(`Multiple upload failed: ${error.message}`);
  }
};

export default cloudinary;