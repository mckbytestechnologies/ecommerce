import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Coupon code is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Coupon description is required"],
    },
    discount_type: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    discount_value: {
      type: Number,
      required: [true, "Discount value is required"],
      min: [0, "Discount value cannot be negative"],
    },
    min_order_amount: {
      type: Number,
      default: 0,
    },
    max_discount_amount: {
      type: Number,
      default: null,
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
    usage_limit: {
      type: Number,
      default: null,
    },
    used_count: {
      type: Number,
      default: 0,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    applicable_categories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Category",
      },
    ],
    excluded_products: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
      },
    ],
    user_specific: {
      type: Boolean,
      default: false,
    },
    allowed_users: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    created_by: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for active coupons
couponSchema.index({ code: 1, is_active: 1 });
couponSchema.index({ end_date: 1 });

// Virtual for is_expired
couponSchema.virtual("is_expired").get(function () {
  return this.end_date < new Date();
});

// Virtual for is_available
couponSchema.virtual("is_available").get(function () {
  return (
    this.is_active &&
    this.start_date <= new Date() &&
    this.end_date >= new Date() &&
    (this.usage_limit === null || this.used_count < this.usage_limit)
  );
});

const CouponModel = mongoose.model("Coupon", couponSchema);
export default CouponModel;