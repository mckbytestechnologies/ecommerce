import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Address name is required"],
      trim: true,
    },
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
    },
    address_line: {
      type: String,
      required: [true, "Address line is required"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
    },
    state: {
      type: String,
      required: [true, "State is required"],
    },
    pincode: {
      type: String,
      required: [true, "Pincode is required"],
    },
    country: {
      type: String,
      default: "India",
    },
    landmark: {
      type: String,
      default: "",
    },
    address_type: {
      type: String,
      enum: ["home", "work", "other"],
      default: "home",
    },
    is_default: {
      type: Boolean,
      default: false,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure only one default address per user
addressSchema.index({ user: 1, is_default: 1 }, { unique: true, partialFilterExpression: { is_default: true } });

const AddressModel = mongoose.model("Address", addressSchema);
export default AddressModel;