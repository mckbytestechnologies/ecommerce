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
      images: existingImages,
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

    // Handle image upload - from files or existing URLs
    let images = [];

    // If images are provided in the request body (from frontend JSON)
    if (existingImages && Array.isArray(existingImages) && existingImages.length > 0) {
      images = existingImages;
    }

    // If files are uploaded via multer
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinaryUpload(file.path, "products");
        images.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
    }

    // Parse tags
    let parsedTags = [];
    if (tags) {
      if (typeof tags === 'string') {
        try {
          parsedTags = JSON.parse(tags);
        } catch (e) {
          parsedTags = tags.split(',').map(t => t.trim()).filter(t => t);
        }
      } else if (Array.isArray(tags)) {
        parsedTags = tags;
      }
    }

    // Parse features
    let parsedFeatures = [];
    if (features) {
      if (typeof features === 'string') {
        try {
          parsedFeatures = JSON.parse(features);
        } catch (e) {
          parsedFeatures = features.split('\n').map(f => f.trim()).filter(f => f);
        }
      } else if (Array.isArray(features)) {
        parsedFeatures = features;
      }
    }

    // Parse specifications - CRITICAL FIX
    // Parse specifications - FIXED VERSION
let parsedSpecifications = {};
if (specifications) {
  // If it's already an object, use it directly (this is what we want!)
  if (typeof specifications === 'object' && !Array.isArray(specifications) && specifications !== null) {
    parsedSpecifications = specifications;
    console.log('Specifications already object, using as is:', parsedSpecifications);
  }
  // If it's a string, try to parse it
  else if (typeof specifications === 'string') {
    // Check for the dreaded "[object Object]" error
    if (specifications === '[object Object]') {
      console.log('Received [object Object] string, using empty object');
      parsedSpecifications = {};
    } else {
      try {
        parsedSpecifications = JSON.parse(specifications);
        console.log('Parsed specifications from string:', parsedSpecifications);
      } catch (e) {
        console.error('Error parsing specifications string:', e);
        // If parsing fails, use empty object
        parsedSpecifications = {};
      }
    }
  }
} else {
  // If no specifications provided, use empty object
  parsedSpecifications = {};
}
    // Parse dimensions
    let parsedDimensions = null;
    if (dimensions) {
      if (typeof dimensions === 'object' && !Array.isArray(dimensions) && dimensions !== null) {
        parsedDimensions = dimensions;
      } else if (typeof dimensions === 'string') {
        try {
          parsedDimensions = JSON.parse(dimensions);
        } catch (e) {
          // Try to parse from format "10x5x3"
          const dims = dimensions.split('x').map(d => parseFloat(d.trim()));
          if (dims.length === 3 && dims.every(d => !isNaN(d))) {
            parsedDimensions = {
              length: dims[0],
              width: dims[1],
              height: dims[2]
            };
          }
        }
      }
    }

    // Parse seo
    let parsedSeo = {};
    if (seo) {
      if (typeof seo === 'object' && !Array.isArray(seo) && seo !== null) {
        parsedSeo = seo;
      } else if (typeof seo === 'string') {
        try {
          parsedSeo = JSON.parse(seo);
        } catch (e) {
          console.error('Error parsing seo:', e);
          parsedSeo = {};
        }
      }
    }

    const product = new ProductModel({
      name,
      description,
      price: parseFloat(price),
      comparePrice: comparePrice ? parseFloat(comparePrice) : null,
      category,
      subCategory: subCategory || null,
      brand: brand || null,
      sku: sku || null,
      stock: parseInt(stock) || 0,
      weight: weight ? parseFloat(weight) : null,
      dimensions: parsedDimensions,
      features: parsedFeatures,
      specifications: parsedSpecifications,
      tags: parsedTags,
      images,
      isFeatured: isFeatured === true || isFeatured === 'true',
      isDigital: isDigital === true || isDigital === 'true',
      isActive: true,
      warranty: warranty || null,
      returnPolicy: returnPolicy || null,
      seo: parsedSeo,
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
// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    // Log the raw request body for debugging
    console.log('========== UPDATE PRODUCT REQUEST ==========');
    console.log('Request body type:', typeof req.body);
    console.log('Request body keys:', Object.keys(req.body));
    console.log('Specifications in body:', req.body.specifications);
    console.log('Specifications type:', typeof req.body.specifications);
    console.log('============================================');
    
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
      
      // Merge with existing images
      if (req.body.images && Array.isArray(req.body.images)) {
        req.body.images = [...req.body.images, ...newImages];
      } else {
        req.body.images = [...product.images, ...newImages];
      }
    }

    // Create update data object
    const updateData = { ...req.body };

    // Parse numeric fields
    if (updateData.price) updateData.price = parseFloat(updateData.price);
    if (updateData.comparePrice) updateData.comparePrice = parseFloat(updateData.comparePrice);
    if (updateData.stock) updateData.stock = parseInt(updateData.stock);
    if (updateData.weight) updateData.weight = parseFloat(updateData.weight);

    // Parse boolean fields
    if (updateData.isFeatured !== undefined) {
      updateData.isFeatured = updateData.isFeatured === true || updateData.isFeatured === 'true';
    }
    if (updateData.isDigital !== undefined) {
      updateData.isDigital = updateData.isDigital === true || updateData.isDigital === 'true';
    }
    if (updateData.isActive !== undefined) {
      updateData.isActive = updateData.isActive === true || updateData.isActive === 'true';
    }

    // Parse features
    if (updateData.features) {
      if (typeof updateData.features === 'string') {
        try {
          updateData.features = JSON.parse(updateData.features);
        } catch (e) {
          updateData.features = updateData.features.split('\n').map(f => f.trim()).filter(f => f);
        }
      }
    }

    // FIXED: Handle specifications properly - DON'T try to parse if it's already an object
    if (updateData.specifications !== undefined) {
      // Case 1: It's already an object (good!)
      if (updateData.specifications && typeof updateData.specifications === 'object' && !Array.isArray(updateData.specifications)) {
        console.log('Specifications already an object, using as is:', updateData.specifications);
        // Keep it as is - it's already in the correct format
      }
      // Case 2: It's a string that might be "[object Object]" - treat as empty
      else if (typeof updateData.specifications === 'string') {
        if (updateData.specifications === '[object Object]') {
          console.log('Received [object Object] string, using empty object');
          updateData.specifications = {};
        } else {
          try {
            // Try to parse JSON string
            updateData.specifications = JSON.parse(updateData.specifications);
            console.log('Parsed specifications from string:', updateData.specifications);
          } catch (e) {
            console.error('Error parsing specifications string:', e);
            // If parsing fails, use existing specifications or empty object
            updateData.specifications = product.specifications || {};
          }
        }
      }
      // Case 3: It's null or undefined - use existing
      else if (updateData.specifications === null || updateData.specifications === undefined) {
        updateData.specifications = product.specifications || {};
      }
    } else {
      // If no specifications provided, keep existing ones
      updateData.specifications = product.specifications || {};
    }

    // Parse tags
    if (updateData.tags) {
      if (typeof updateData.tags === 'string') {
        try {
          updateData.tags = JSON.parse(updateData.tags);
        } catch (e) {
          updateData.tags = updateData.tags.split(',').map(t => t.trim()).filter(t => t);
        }
      }
    }

    // Parse dimensions
    if (updateData.dimensions) {
      if (typeof updateData.dimensions === 'string') {
        try {
          updateData.dimensions = JSON.parse(updateData.dimensions);
        } catch (e) {
          // Try to parse from format "10x5x3"
          const dims = updateData.dimensions.split('x').map(d => parseFloat(d.trim()));
          if (dims.length === 3 && dims.every(d => !isNaN(d))) {
            updateData.dimensions = {
              length: dims[0],
              width: dims[1],
              height: dims[2]
            };
          } else {
            updateData.dimensions = null;
          }
        }
      }
    }

    // Parse seo
    if (updateData.seo) {
      if (typeof updateData.seo === 'string') {
        try {
          updateData.seo = JSON.parse(updateData.seo);
        } catch (e) {
          console.error('Error parsing seo:', e);
          updateData.seo = {};
        }
      }
    }

    // Remove undefined or null values that might cause issues
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined || updateData[key] === null) {
        delete updateData[key];
      }
    });

    console.log('Final update data:', JSON.stringify(updateData, null, 2));

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      req.params.id,
      updateData,
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
    if (product.images && product.images.length > 0) {
      for (const image of product.images) {
        if (image.public_id) {
          await cloudinaryDelete(image.public_id);
        }
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
    if (image.public_id) {
      await cloudinaryDelete(image.public_id);
    }

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

// @desc    Get products by category
// @route   GET /api/products/category/:categoryId
// @access  Public
export const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { page = 1, limit = 10, sort = "createdAt", order = "desc" } = req.query;

    // Check if category exists
    const category = await CategoryModel.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        message: "Category not found",
        error: true,
        success: false,
      });
    }

    // Build filter
    const filter = { 
      category: categoryId,
      isActive: true 
    };

    // Sort options
    const sortOptions = {};
    sortOptions[sort] = order === "desc" ? -1 : 1;

    const products = await ProductModel.find(filter)
      .populate("category", "name")
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await ProductModel.countDocuments(filter);

    res.status(200).json({
      message: "Products fetched successfully",
      success: true,
      error: false,
      data: {
        products,
        category: {
          id: category._id,
          name: category.name,
        },
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalProducts: total,
        },
      },
    });
  } catch (error) {
    console.error("Get products by category error:", error);
    res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
};

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
export const searchProducts = async (req, res) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;

    if (!q) {
      return res.status(400).json({
        message: "Search query is required",
        error: true,
        success: false,
      });
    }

    const searchRegex = new RegExp(q, "i");

    const filter = {
      isActive: true,
      $or: [
        { name: searchRegex },
        { description: searchRegex },
        { brand: searchRegex },
        { tags: { $in: [searchRegex] } },
      ],
    };

    const products = await ProductModel.find(filter)
      .populate("category", "name")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select("name price images brand averageRating");

    const total = await ProductModel.countDocuments(filter);

    res.status(200).json({
      message: "Search results fetched successfully",
      success: true,
      error: false,
      data: {
        products,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalResults: total,
        },
      },
    });
  } catch (error) {
    console.error("Search products error:", error);
    res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
};