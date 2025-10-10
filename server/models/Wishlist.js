import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
          required: true,
        },
        added_at: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Ensure unique products in wishlist
wishlistSchema.path("items").validate(function (items) {
  const productIds = items.map(item => item.product.toString());
  return new Set(productIds).size === productIds.length;
}, "Duplicate products in wishlist");

// ❌ Previously: wishlistModel (does not exist)
// ✅ Correct: pass the schema object
const WishlistModel = mongoose.model("Wishlist", wishlistSchema);

export default WishlistModel;
