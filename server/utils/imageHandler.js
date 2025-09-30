// utils/imageHandler.js
import fs from "fs";
import path from "path";

// Ensure upload directory exists
export const ensureUploadDir = () => {
  const dir = "uploads/products";
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Save image locally
export const saveImage = (file) => {
  ensureUploadDir();
  
  return {
    filename: file.filename,
    path: file.path,
    url: `/uploads/products/${file.filename}`
  };
};

// Delete image
export const deleteImage = (filename) => {
  try {
    const filePath = path.join("uploads", "products", filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error deleting image:", error);
    return false;
  }
};

// Delete multiple images
export const deleteMultipleImages = (images) => {
  try {
    images.forEach(image => {
      deleteImage(image.filename);
    });
    return true;
  } catch (error) {
    console.error("Error deleting multiple images:", error);
    return false;
  }
};