import express from "express";
import {
  getAdminBlogs,
  getAdminBlogById,
  createAdminBlog,
  updateAdminBlog,
  deleteAdminBlog,
  deleteAdminBlogPermanent,
  updateBlogStatus,
  bulkUpdateBlogStatus,
  getBlogStats,
  updateBlogSliderStatus
} from "../controllers/blogAdminController.js";

import { authenticate, authorize } from "../middleware/auth.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Admin blog routes
router.get("/", authenticate, authorize("admin"), getAdminBlogs);
router.get("/stats", authenticate, authorize("admin"), getBlogStats);
router.get("/:id", authenticate, authorize("admin"), getAdminBlogById);

router.post(
  "/",
  authenticate,
  authorize("admin"),
  upload.single("featuredImage"),
  createAdminBlog
);

router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  upload.single("featuredImage"),
  updateAdminBlog
);

router.patch("/:id/status", authenticate, authorize("admin"), updateBlogStatus);
router.patch("/bulk-status", authenticate, authorize("admin"), bulkUpdateBlogStatus);
router.patch("/:id/slider", authenticate, authorize("admin"), updateBlogSliderStatus);

router.delete("/:id", authenticate, authorize("admin"), deleteAdminBlog);
router.delete("/:id/permanent", authenticate, authorize("admin"), deleteAdminBlogPermanent);

export default router;
