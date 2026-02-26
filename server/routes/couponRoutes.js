import express from "express";
import {
  getCoupons,
  getCoupon,
  getActiveCoupons,
  createCoupon,
  validateCoupon,
  updateCoupon,
  deleteCoupon,
  toggleCouponStatus,
  bulkDeleteCoupons,
  bulkUpdateCouponStatus,
   applyCouponToCart,
  removeCouponFromCart
} from "../controllers/couponController.js";

import { authenticate, authorize } from "../middleware/auth.js";
import { validateCoupon as validateCouponData } from "../middleware/validation.js";
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

const router = express.Router();

// ==================== PUBLIC ROUTES ====================
// No authentication required - for gift box and public display
router.get("/active", getActiveCoupons);


// ==================== USER ROUTES ====================
// Authentication required but not admin
router.post("/validate", authenticate, validateCoupon);
// Cart coupon routes
router.post("/apply-coupon", authenticate, applyCouponToCart);
router.delete("/remove-coupon", authenticate, removeCouponFromCart);

// ==================== ADMIN ROUTES ====================
// All routes below require authentication and admin role
router.get("/", authenticate, authorize("admin"), getCoupons);
router.get("/:id", authenticate, authorize("admin"), getCoupon);
router.post("/", authenticate, authorize("admin"), validateCouponData, createCoupon);
router.put("/:id", authenticate, authorize("admin"), validateCouponData, updateCoupon);
router.delete("/:id", authenticate, authorize("admin"), deleteCoupon);
router.put("/:id/toggle", authenticate, authorize("admin"), toggleCouponStatus);


// Bulk operations
router.delete("/bulk", authenticate, authorize("admin"), bulkDeleteCoupons);
router.put("/bulk/status", authenticate, authorize("admin"), bulkUpdateCouponStatus);

// ==================== DATA ROUTES FOR DROPDOWNS ====================
// These require authentication (for admin panel)
router.get("/data/categories", authenticate, authorize("admin"), async (req, res) => {
  try {
    const categories = await Category.find({}, 'name _id').sort('name');
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
});

router.get("/data/products", authenticate, authorize("admin"), async (req, res) => {
  try {
    const products = await Product.find({}, 'name price _id').sort('name');
    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
});

router.get("/data/users", authenticate, authorize("admin"), async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }, 'name email _id').sort('name');
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
});

export default router;