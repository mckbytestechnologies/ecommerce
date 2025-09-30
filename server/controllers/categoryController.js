import CategoryModel from "../models/Category.js";
import ProductModel from "../models/Product.js";
import { cloudinaryUpload, cloudinaryDelete } from "../utils/cloudinary.js";

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find({ isActive: true })
      .populate("parentCategory", "name")
      .sort({ name: 1 });

    res.status(200).json({
      message: "Categories fetched successfully",
      success: true,
      error: false,
      data: categories,
    });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
};

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
export const getCategory = async (req, res) => {
  try {
    const category = await CategoryModel.findById(req.params.id)
      .populate("parentCategory", "name")
      .populate("subcategories", "name");

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
        error: true,
        success: false,
      });
    }

    res.status(200).json({
      message: "Category fetched successfully",
      success: true,
      error: false,
      data: category,
    });
  } catch (error) {
    console.error("Get category error:", error);
    res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
};

// @desc    Create category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = async (req, res) => {
  try {
    const { name, description, parentCategory, seo } = req.body;

    // Check if category already exists
    const existingCategory = await CategoryModel.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });

    if (existingCategory) {
      return res.status(400).json({
        message: "Category already exists",
        error: true,
        success: false,
      });
    }

    // Check if parent category exists
    if (parentCategory) {
      const parentExists = await CategoryModel.findById(parentCategory);
      if (!parentExists) {
        return res.status(400).json({
          message: "Parent category not found",
          error: true,
          success: false,
        });
      }
    }

    // Handle image upload
    let image = null;
    if (req.file) {
      const result = await cloudinaryUpload(req.file.path, "categories");
      image = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }

    const category = new CategoryModel({
      name,
      description,
      parentCategory: parentCategory || null,
      image,
      seo: seo ? JSON.parse(seo) : {},
      createdBy: req.user._id,
    });

    await category.save();

    res.status(201).json({
      message: "Category created successfully",
      success: true,
      error: false,
      data: category,
    });
  } catch (error) {
    console.error("Create category error:", error);
    res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = async (req, res) => {
  try {
    const category = await CategoryModel.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
        error: true,
        success: false,
      });
    }

    // Check if name already exists (excluding current category)
    if (req.body.name) {
      const existingCategory = await CategoryModel.findOne({
        name: { $regex: new RegExp(`^${req.body.name}$`, "i") },
        _id: { $ne: req.params.id },
      });

      if (existingCategory) {
        return res.status(400).json({
          message: "Category name already exists",
          error: true,
          success: false,
        });
      }
    }

    // Handle image upload
    if (req.file) {
      // Delete old image if exists
      if (category.image && category.image.public_id) {
        await cloudinaryDelete(category.image.public_id);
      }

      const result = await cloudinaryUpload(req.file.path, "categories");
      req.body.image = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }

    // Parse SEO if exists
    if (req.body.seo) {
      req.body.seo = JSON.parse(req.body.seo);
    }

    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("parentCategory", "name");

    res.status(200).json({
      message: "Category updated successfully",
      success: true,
      error: false,
      data: updatedCategory,
    });
  } catch (error) {
    console.error("Update category error:", error);
    res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req, res) => {
  try {
    const category = await CategoryModel.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
        error: true,
        success: false,
      });
    }

    // Check if category has products
    const productCount = await ProductModel.countDocuments({
      category: req.params.id,
    });

    if (productCount > 0) {
      return res.status(400).json({
        message: `Cannot delete category. ${productCount} products are associated with this category.`,
        error: true,
        success: false,
      });
    }

    // Check if category has subcategories
    const subcategoryCount = await CategoryModel.countDocuments({
      parentCategory: req.params.id,
    });

    if (subcategoryCount > 0) {
      return res.status(400).json({
        message: `Cannot delete category. ${subcategoryCount} subcategories exist.`,
        error: true,
        success: false,
      });
    }

    // Delete image from Cloudinary
    if (category.image && category.image.public_id) {
      await cloudinaryDelete(category.image.public_id);
    }

    await CategoryModel.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Category deleted successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
};

// @desc    Get categories with product count
// @route   GET /api/categories/with-counts
// @access  Public
export const getCategoriesWithCounts = async (req, res) => {
  try {
    const categories = await CategoryModel.aggregate([
      { $match: { isActive: true } },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "category",
          as: "products",
        },
      },
      {
        $project: {
          name: 1,
          description: 1,
          image: 1,
          parentCategory: 1,
          productCount: { $size: "$products" },
        },
      },
      { $sort: { name: 1 } },
    ]);

    res.status(200).json({
      message: "Categories with counts fetched successfully",
      success: true,
      error: false,
      data: categories,
    });
  } catch (error) {
    console.error("Get categories with counts error:", error);
    res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
};