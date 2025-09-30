import express from "express";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteProductImage,
  getFeaturedProducts,
  getRelatedProducts,
} from "../controllers/productController.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { validateProduct, validateProductQuery } from "../middleware/validation.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Public routes
router.get("/", validateProductQuery, getProducts);
router.get("/featured", getFeaturedProducts);
router.get("/:id", getProduct);
router.get("/:id/related", getRelatedProducts);

// Protected admin routes
router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  upload.array("images", 5), // Max 5 images
  validateProduct,
  createProduct
);

router.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  upload.array("images", 5),
  validateProduct,
  updateProduct
);

router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  deleteProduct
);

router.delete(
  "/:id/images/:imageId",
  authenticate,
  authorize("ADMIN"),
  deleteProductImage
);

export default router;