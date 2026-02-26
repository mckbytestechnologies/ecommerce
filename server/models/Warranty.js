import mongoose from "mongoose";

const warrantySchema = new mongoose.Schema(
  {
    // Product Information
    productModel: {
      type: String,
      required: [true, "Product model/serial is required"],
      trim: true,
    },
    purchaseDate: {
      type: Date,
      required: [true, "Purchase date is required"],
    },
    
    // Purchaser Details
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },
    mobileNumber: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true,
    },
    
    // Optional: Link to user if authenticated
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    
    // Status
    status: {
      type: String,
      enum: ["pending", "active", "expired", "rejected"],
      default: "pending",
    },
    
    // Warranty Period (calculated from purchase date)
    warrantyEndDate: {
      type: Date,
    },
    
    // Metadata
    registeredAt: {
      type: Date,
      default: Date.now,
    },
    ipAddress: String,
    userAgent: String,
  },
  {
    timestamps: true,
  }
);

// Calculate warranty end date (1 year from purchase by default)
warrantySchema.pre("save", function (next) {
  if (this.purchaseDate && !this.warrantyEndDate) {
    const endDate = new Date(this.purchaseDate);
    endDate.setFullYear(endDate.getFullYear() + 1); // 1 year warranty
    this.warrantyEndDate = endDate;
  }
  next();
});

// Indexes for better query performance
warrantySchema.index({ email: 1 });
warrantySchema.index({ productModel: 1 });
warrantySchema.index({ status: 1 });
warrantySchema.index({ createdAt: -1 });

const Warranty = mongoose.model("Warranty", warrantySchema);
export default Warranty;