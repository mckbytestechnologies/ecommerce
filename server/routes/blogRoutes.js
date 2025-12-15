import express from "express";
import {
  getAllBlogs,
  getBlogSlider,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  updateBlogSliderStatus,
  getBlogCategories,
  getPopularTags
} from "../controllers/blogController.js";

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
  updateBlogSliderStatus as adminUpdateBlogSliderStatus
} from "../controllers/blogAdminController.js";

import { authenticate, authorize } from "../middleware/auth.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllBlogs);
router.get("/slider", getBlogSlider);
router.get("/categories", getBlogCategories);
router.get("/tags/popular", getPopularTags);
router.get("/:slug", getBlogBySlug);

// Admin routes
router.get("/admin/blogs", authenticate, authorize("admin"), getAdminBlogs);
router.get("/admin/blogs/stats", authenticate, authorize("admin"), getBlogStats);
router.get("/admin/blogs/:id", authenticate, authorize("admin"), getAdminBlogById);

router.post("/admin/blogs", 
  authenticate, 
  authorize("admin"), 
  upload.single("featuredImage"), 
  createAdminBlog
);

router.put("/admin/blogs/:id", 
  authenticate, 
  authorize("admin"), 
  upload.single("featuredImage"), 
  updateAdminBlog
);

router.patch("/admin/blogs/:id/status", 
  authenticate, 
  authorize("admin"), 
  updateBlogStatus
);

router.patch("/admin/blogs/bulk-status", 
  authenticate, 
  authorize("admin"), 
  bulkUpdateBlogStatus
);

router.patch("/admin/blogs/:id/slider", 
  authenticate, 
  authorize("admin"), 
  adminUpdateBlogSliderStatus
);

router.delete("/admin/blogs/:id", 
  authenticate, 
  authorize("admin"), 
  deleteAdminBlog
);

router.delete("/admin/blogs/:id/permanent", 
  authenticate, 
  authorize("admin"), 
  deleteAdminBlogPermanent
);

// Original routes (for backward compatibility)
router.route("/")
  .post(authenticate, authorize("admin"), upload.single("featuredImage"), createBlog);

router.route("/:id")
  .put(authenticate, authorize("admin"), upload.single("featuredImage"), updateBlog)
  .delete(authenticate, authorize("admin"), deleteBlog);

router.put("/:id/slider", authenticate, authorize("admin"), updateBlogSliderStatus);

export default router;