import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    order_id: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
        name: String,
        image: String,
      },
    ],
    shipping_address: {
      type: mongoose.Schema.ObjectId,
      ref: "Address",
      required: true,
    },
    billing_address: {
      type: mongoose.Schema.ObjectId,
      ref: "Address",
    },
    payment_method: {
      type: String,
      enum: ["card", "upi", "netbanking", "cod", "wallet"],
      required: true,
    },
    payment_status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed", "refunded"],
      default: "pending",
    },
    payment_id: {
      type: String,
      default: null,
    },
    order_status: {
      type: String,
      enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    subtotal: {
      type: Number,
      required: true,
    },
    shipping_charge: {
      type: Number,
      default: 0,
    },
    tax_amount: {
      type: Number,
      default: 0,
    },
    discount_amount: {
      type: Number,
      default: 0,
    },
    total_amount: {
      type: Number,
      required: true,
    },
    coupon_applied: {
      type: mongoose.Schema.ObjectId,
      ref: "Coupon",
    },
    tracking_number: {
      type: String,
      default: null,
    },
    shipping_carrier: {
      type: String,
      default: null,
    },
    expected_delivery: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      default: "",
    },
    cancellation_reason: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Generate order ID before saving
orderSchema.pre("save", async function (next) {
  if (this.isNew) {
    const date = new Date();
    const timestamp = date.getTime();
    const random = Math.floor(Math.random() * 1000);
    this.order_id = `ORD${timestamp}${random}`;
  }
  next();
});

// Update product sold count when order is delivered
orderSchema.post("save", async function (doc) {
  if (doc.order_status === "delivered") {
    for (const item of doc.items) {
      await mongoose.model("Product").findByIdAndUpdate(item.product, {
        $inc: { soldCount: item.quantity },
      });
    }
  }
});

const OrderModel = mongoose.model("Order", orderSchema);
export default OrderModel;