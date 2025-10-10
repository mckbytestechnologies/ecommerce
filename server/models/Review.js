import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot be more than 5"],
    },
    title: {
      type: String,
      required: [true, "Review title is required"],
      trim: true,
      maxLength: [100, "Title cannot exceed 100 characters"],
    },
    comment: {
      type: String,
      required: [true, "Review comment is required"],
      trim: true,
      maxLength: [1000, "Comment cannot exceed 1000 characters"],
    },
    images: [
      {
        public_id: String,
        url: String,
      },
    ],
    likes: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    dislikes: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    is_verified_purchase: {
      type: Boolean,
      default: false,
    },
    is_approved: {
      type: Boolean,
      default: true,
    },
    helpful_count: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure one review per user per product
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

// Update product rating when review is saved
reviewSchema.post("save", async function () {
  await this.model("Product").updateAverageRating(this.product);
});

reviewSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await doc.model("Product").updateAverageRating(doc.product);
  }
});

const ReviewModel = mongoose.model("Review", reviewSchema);
export default ReviewModel;