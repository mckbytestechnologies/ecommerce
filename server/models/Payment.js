// models/Payment.js
import mongoose from "mongoose";

// models/Payment.js
const paymentSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.ObjectId,
    ref: "Order",
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  payment_id: {
    type: String,
    sparse: true, // Allow null for Razorpay orders
  },
  razorpay_order_id: {  // Make sure this field exists
    type: String,
    sparse: true,
  },
  payment_method: {
    type: String,
    required: true,
    enum: ["card", "upi", "netbanking", "wallet", "cod"],
  },
  payment_gateway: {
    type: String,
    enum: ["stripe", "razorpay", "none"],
    default: "none",
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: "INR",
  },
  status: {
    type: String,
    enum: ["pending", "processing", "completed", "failed", "refunded"],
    default: "pending",
  },
  gateway_response: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  captured_at: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});
// Indexes for better query performance
paymentSchema.index({ payment_id: 1 }, { sparse: true });
paymentSchema.index({ razorpay_order_id: 1 }, { sparse: true });
paymentSchema.index({ user: 1, createdAt: -1 });
paymentSchema.index({ order: 1 });

const PaymentModel = mongoose.model("Payment", paymentSchema);
export default PaymentModel;