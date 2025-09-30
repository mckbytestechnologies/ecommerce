import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
      maxLength: [100, "Category name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      maxLength: [500, "Description cannot exceed 500 characters"],
    },
    image: {
      public_id: String,
      url: String,
    },
    parentCategory: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    seo: {
      title: String,
      description: String,
      slug: {
        type: String,
        unique: true,
        sparse: true,
      },
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for subcategories
categorySchema.virtual("subcategories", {
  ref: "Category",
  localField: "_id",
  foreignField: "parentCategory",
});

categorySchema.index({ name: 1, isActive: 1 });

const CategoryModel = mongoose.model("Category", categorySchema);
export default CategoryModel;