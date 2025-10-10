import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
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
      required: true,
      unique: true,
    },
    payment_method: {
      type: String,
      required: true,
    },
    payment_gateway: {
      type: String,
      enum: ["stripe", "razorpay", "paypal"],
      required: true,
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
    refund_amount: {
      type: Number,
      default: 0,
    },
    refund_reason: {
      type: String,
      default: "",
    },
    captured_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for payment tracking
paymentSchema.index({ payment_id: 1 });
paymentSchema.index({ user: 1, created_at: -1 });

const PaymentModel = mongoose.model("Payment", paymentSchema);
export default PaymentModel;