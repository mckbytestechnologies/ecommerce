import express from "express";
import {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder,
  getOrderStats,
} from "../controllers/orderController.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { validateOrder } from "../middleware/validation.js";

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// User routes
router.post("/", validateOrder, createOrder);
router.get("/", getOrders);
router.get("/:id", getOrder);
router.put("/:id/cancel", cancelOrder);

// Admin routes
router.use(authorize("admin"));
router.put("/:id/status", updateOrderStatus);
router.get("/stats", getOrderStats);

export default router;