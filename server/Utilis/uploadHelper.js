import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to upload image to local storage
export const uploadImage = (file, folder = "uploads") => {
  try {
    // Create folder if it doesn't exist
    const uploadDir = path.join(__dirname, `../${folder}`);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    const filePath = path.join(uploadDir, uniqueName);

    // Move file to upload directory
    fs.writeFileSync(filePath, file.buffer);

    // Return file URL
    const baseUrl = process.env.BASE_URL || "https://ecommerce-server-fhna.onrender.com";
    const url = `${baseUrl}/${folder}/${uniqueName}`;

    return {
      success: true,
      url,
      path: filePath,
      filename: uniqueName
    };
  } catch (error) {
    console.error("Upload error:", error);
    throw new Error("Failed to upload image");
  }
};

// Function to delete uploaded file
export const deleteImage = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Delete error:", error);
    return false;
  }
};

// Function to validate image
export const validateImage = (file, maxSize = 5 * 1024 * 1024) => { // 5MB default
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
  
  if (!allowedTypes.includes(file.mimetype)) {
    throw new Error("Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.");
  }
  
  if (file.size > maxSize) {
    throw new Error(`File size too large. Maximum size is ${maxSize / 1024 / 1024}MB.`);
  }
  
  return true;
};