import ProductModel from "../models/Product.js";
import CategoryModel from "../models/Category.js";
import { cloudinaryUpload, cloudinaryDelete } from "../utils/cloudinary.js";

// @desc    Get all products with filtering, sorting, and pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      minPrice,
      maxPrice,
      brand,
      sort = "createdAt",
      order = "desc",
      featured,
      inStock,
    } = req.query;

    // Build filter object
    let filter = { isActive: true };

    // Search filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Brand filter
    if (brand) {
      filter.brand = { $regex: brand, $options: "i" };
    }

    // Featured filter
    if (featured !== undefined) {
      filter.isFeatured = featured === "true";
    }

    // Stock filter
    if (inStock !== undefined) {
      if (inStock === "true") {
        filter.stock = { $gt: 0 };
      } else {
        filter.stock = 0;
      }
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sort] = order === "desc" ? -1 : 1;

    // Execute query with population
    const products = await ProductModel.find(filter)
      .populate("category", "name")
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select("-specifications"); // Exclude specifications by default

    // Get total count for pagination
    const total = await ProductModel.countDocuments(filter);

    res.status(200).json({
      message: "Products fetched successfully",
      success: true,
      error: false,
      data: {
        products,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalProducts: total,
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id)
      .populate("category", "name description")
      .populate({
        path: "reviews",
        populate: {
          path: "user",
          select: "name avatar",
        },
      });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        error: true,
        success: false,
      });
    }

    if (!product.isActive && req.user?.role !== "ADMIN") {
      return res.status(404).json({
        message: "Product not found",
        error: true,
        success: false,
      });
    }

    res.status(200).json({
      message: "Product fetched successfully",
      success: true,
      error: false,
      data: product,
    });
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      comparePrice,
      category,
      subCategory,
      brand,
      sku,
      stock,
      weight,
      dimensions,
      features,
      specifications,
      tags,
      isFeatured,
      isDigital,
      warranty,
      returnPolicy,
      seo,
    } = req.body;

    // Check if category exists
    const categoryExists = await CategoryModel.findById(category);
    if (!categoryExists) {
      return res.status(400).json({
        message: "Category not found",
        error: true,
        success: false,
      });
    }

    // Check if SKU already exists
    if (sku) {
      const existingProduct = await ProductModel.findOne({ sku });
      if (existingProduct) {
        return res.status(400).json({
          message: "SKU already exists",
          error: true,
          success: false,
        });
      }
    }

    // Handle image upload
    let images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinaryUpload(file.path, "products");
        images.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
    }

    const product = new ProductModel({
      name,
      description,
      price,
      comparePrice,
      category,
      subCategory,
      brand,
      sku,
      stock,
      weight,
      dimensions,
      features: features ? JSON.parse(features) : [],
      specifications: specifications ? JSON.parse(specifications) : {},
      tags: tags ? JSON.parse(tags) : [],
      images,
      isFeatured,
      isDigital,
      warranty,
      returnPolicy,
      seo: seo ? JSON.parse(seo) : {},
      createdBy: req.user._id,
    });

    await product.save();

    // Populate category before sending response
    await product.populate("category", "name");

    res.status(201).json({
      message: "Product created successfully",
      success: true,
      error: false,
      data: product,
    });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        error: true,
        success: false,
      });
    }

    // Check if SKU already exists (excluding current product)
    if (req.body.sku && req.body.sku !== product.sku) {
      const existingProduct = await ProductModel.findOne({
        sku: req.body.sku,
        _id: { $ne: req.params.id },
      });
      if (existingProduct) {
        return res.status(400).json({
          message: "SKU already exists",
          error: true,
          success: false,
        });
      }
    }

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      const newImages = [];
      for (const file of req.files) {
        const result = await cloudinaryUpload(file.path, "products");
        newImages.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
      req.body.images = [...product.images, ...newImages];
    }

    // Parse JSON fields if they exist
    if (req.body.features) {
      req.body.features = JSON.parse(req.body.features);
    }
    if (req.body.specifications) {
      req.body.specifications = JSON.parse(req.body.specifications);
    }
    if (req.body.tags) {
      req.body.tags = JSON.parse(req.body.tags);
    }
    if (req.body.seo) {
      req.body.seo = JSON.parse(req.body.seo);
    }

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("category", "name");

    res.status(200).json({
      message: "Product updated successfully",
      success: true,
      error: false,
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        error: true,
        success: false,
      });
    }

    // Delete images from Cloudinary
    if (product.images.length > 0) {
      for (const image of product.images) {
        await cloudinaryDelete(image.public_id);
      }
    }

    await ProductModel.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Product deleted successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
};

// @desc    Delete product image
// @route   DELETE /api/products/:id/images/:imageId
// @access  Private/Admin
export const deleteProductImage = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        error: true,
        success: false,
      });
    }

    const image = product.images.id(req.params.imageId);
    if (!image) {
      return res.status(404).json({
        message: "Image not found",
        error: true,
        success: false,
      });
    }

    // Delete from Cloudinary
    await cloudinaryDelete(image.public_id);

    // Remove from array
    product.images.pull({ _id: req.params.imageId });
    await product.save();

    res.status(200).json({
      message: "Image deleted successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Delete product image error:", error);
    res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await ProductModel.find({
      isFeatured: true,
      isActive: true,
      stock: { $gt: 0 },
    })
      .populate("category", "name")
      .limit(8)
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Featured products fetched successfully",
      success: true,
      error: false,
      data: products,
    });
  } catch (error) {
    console.error("Get featured products error:", error);
    res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
};

// @desc    Get related products
// @route   GET /api/products/:id/related
// @access  Public
export const getRelatedProducts = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        error: true,
        success: false,
      });
    }

    const relatedProducts = await ProductModel.find({
      category: product.category,
      _id: { $ne: product._id },
      isActive: true,
    })
      .populate("category", "name")
      .limit(4)
      .select("name price images averageRating");

    res.status(200).json({
      message: "Related products fetched successfully",
      success: true,
      error: false,
      data: relatedProducts,
    });
  } catch (error) {
    console.error("Get related products error:", error);
    res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
};