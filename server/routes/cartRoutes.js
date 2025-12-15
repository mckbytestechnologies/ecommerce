import express from "express";
import {
  getCart,
  addItemToCart,
  updateCartItem,
  removeItemFromCart,
  clearCart,
  applyCoupon,
} from "../controllers/cartController.js";
import { authenticate } from "../middleware/auth.js";
const router = express.Router();
// :lock: All cart routes require authentication
router.use(authenticate);
// Cart routes
router.get("/", getCart);
router.post("/", addItemToCart);
router.put("/:itemId", updateCartItem);
router.delete("/:itemId", removeItemFromCart);
router.delete("/", clearCart);
router.post("/apply-coupon", applyCoupon);
export default router;