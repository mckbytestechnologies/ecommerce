import express from "express";
import {
  getCoupons,
  getActiveCoupons,
  createCoupon,
  validateCoupon,
  updateCoupon,
  deleteCoupon,
  toggleCouponStatus,
} from "../controllers/couponController.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { validateCoupon as validateCouponData } from "../middleware/validation.js";

const router = express.Router();

// Public routes
router.get("/active", getActiveCoupons);

// Protected user routes
router.use(authenticate);
router.post("/validate", validateCoupon);

// Admin routes
router.use(authorize("admin"));
router.get("/", getCoupons);
router.post("/", validateCouponData, createCoupon);
router.put("/:id", validateCouponData, updateCoupon);
router.delete("/:id", deleteCoupon);
router.put("/:id/toggle", toggleCouponStatus);

export default router;