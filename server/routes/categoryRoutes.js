import express from "express";
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoriesWithCounts,
} from "../controllers/categoryController.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { validateCategory } from "../middleware/validation.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Public routes
router.get("/", getCategories);
router.get("/with-counts", getCategoriesWithCounts);
router.get("/:id", getCategory);

// Protected admin routes
router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  upload.single("image"),
  validateCategory,
  createCategory
);

router.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  upload.single("image"),
  validateCategory,
  updateCategory
);

router.delete("/:id", authenticate, authorize("ADMIN"), deleteCategory);

export default router;