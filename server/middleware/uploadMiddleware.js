import multer from "multer";
import { validateImage } from "../utilis/uploadHelper.js";

// Configure multer memory storage
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  try {
    validateImage(file);
    cb(null, true);
  } catch (error) {
    cb(error, false);
  }
};

// Create upload middleware
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

export default upload;