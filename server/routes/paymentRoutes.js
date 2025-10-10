import express from "express";
import {
  createPaymentIntent,
  createRazorpayOrder,
  confirmPayment,
  getPaymentDetails,
  getMyPayments,
  stripeWebhook,
} from "../controllers/paymentController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// Webhook (no authentication needed)
router.post("/webhook/stripe", express.raw({ type: "application/json" }), stripeWebhook);

// Protected routes
router.use(authenticate);

router.post("/create-intent", createPaymentIntent);
router.post("/create-razorpay-order", createRazorpayOrder);
router.post("/confirm", confirmPayment);
router.get("/:id", getPaymentDetails);
router.get("/user/my-payments", getMyPayments);

export default router;