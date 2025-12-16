import express from "express";
import {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog
} from "../controllers/blogController.js";
import { authenticate } from "../middleware/auth.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getBlogs);
router.get("/:id", getBlogById);

// Protected routes (with image upload)
router.post("/", authenticate, upload.single("image"), createBlog);
router.put("/:id", authenticate, upload.single("image"), updateBlog);
router.delete("/:id", authenticate, deleteBlog);

export default router;