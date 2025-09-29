import mongoose from "mongoose";
const orderSchema = new mongoose.Schema(
  {
    userId :{
            type : mongoose.Schema.ObjectId,
            ref : 'User'
        },
    orderId: {
      type: String,
      required: [true, "Provide email"],
      unique: true,
    },
    productId :{
            type : mongoose.Schema.ObjectId,
            ref : 'product'
    },
    product_details: {
      name: String,
      default: null,
    },
    paymentId: {
      type: Number,
      default: "",
    },
    payment_status: {
      type: String,
      default: "",
    },
    delivery_address :{
            type : mongoose.Schema.ObjectId,
            ref : 'address'
        },
    subTotalamt: {
      type:Number,
      default: 0,
    },
    totalamt: {
      type:Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);
const OrderModel = mongoose.model("order", orderSchema);
export default OrderModel;