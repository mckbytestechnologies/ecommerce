import Coupon from "../models/Coupon.js";
import Cart from "../models/Cart.js";

// @desc    Get all coupons with filtering, sorting, and pagination (Admin)
// @route   GET /api/coupons
// @access  Private/Admin
export const getCoupons = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      active,
      search,
      discountType,
      sort = "createdAt",
      order = "desc"
    } = req.query;
    
    // Build filter object
    let filter = {};

    // Active filter (custom logic for coupons)
    if (active === "true") {
      const now = new Date();
      filter = {
        ...filter,
        is_active: true,
        start_date: { $lte: now },
        end_date: { $gte: now },
      };
    } else if (active === "false") {
      filter.is_active = false;
    }

    // Search filter (by code or description)
    if (search) {
      filter.$or = [
        { code: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Discount type filter
    if (discountType) {
      filter.discount_type = discountType;
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sort] = order === "desc" ? -1 : 1;

    // Execute query with population
    const coupons = await Coupon.find(filter)
      .populate("created_by", "name email")
      .populate("applicable_categories", "name")
      .populate("excluded_products", "name")
      .populate("allowed_users", "name email")
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    // Get total count for pagination
    const total = await Coupon.countDocuments(filter);

    res.status(200).json({
      message: "Coupons fetched successfully",
      success: true,
      error: false,
      data: {
        coupons,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalCoupons: total,
          hasNext: parseInt(page) * parseInt(limit) < total,
          hasPrev: parseInt(page) > 1,
        },
      },
    });
  } catch (error) {
    console.error("Get coupons error:", error);
    res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
};

// @desc    Get active coupons for user (Public route - no auth required)
// @route   GET /api/coupons/active
// @access  Public
export const getActiveCoupons = async (req, res) => {
  try {
    const now = new Date();
    
    // Base query for active coupons
    let query = {
      is_active: true,
      start_date: { $lte: now },
      end_date: { $gte: now },
      $or: [
        { usage_limit: null },
        { $expr: { $lt: ["$used_count", "$usage_limit"] } } // Compare fields properly
      ]
    };

    // If user is authenticated, include user-specific coupons
    if (req.user && req.user._id) {
      query = {
        ...query,
        $or: [
          { user_specific: false },
          { user_specific: true, allowed_users: req.user._id }
        ]
      };
    } else {
      // If no user, only show non-user-specific coupons
      query.user_specific = false;
    }

    const coupons = await Coupon.find(query)
      .populate("applicable_categories", "name")
      .select("-allowed_users -created_by")
      .sort("-discount_value")
      .limit(20); // Limit to 20 coupons for performance

    res.status(200).json({
      message: "Active coupons fetched successfully",
      success: true,
      error: false,
      data: coupons,
    });
  } catch (error) {
    console.error("Get active coupons error:", error);
    res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
};

// @desc    Get single coupon by ID (Admin)
// @route   GET /api/coupons/:id
// @access  Private/Admin
export const getCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id)
      .populate("created_by", "name email")
      .populate("applicable_categories", "name")
      .populate("excluded_products", "name")
      .populate("allowed_users", "name email");

    if (!coupon) {
      return res.status(404).json({
        message: "Coupon not found",
        error: true,
        success: false,
      });
    }

    res.status(200).json({
      message: "Coupon fetched successfully",
      success: true,
      error: false,
      data: coupon,
    });
  } catch (error) {
    console.error("Get coupon error:", error);
    res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
};

// @desc    Create coupon (Admin)
// @route   POST /api/coupons
// @access  Private/Admin
export const createCoupon = async (req, res) => {
  try {
    const {
      code,
      description,
      discount_type,
      discount_value,
      min_order_amount,
      max_discount_amount,
      start_date,
      end_date,
      usage_limit,
      applicable_categories,
      excluded_products,
      user_specific,
      allowed_users,
    } = req.body;

    // Check if coupon code already exists
    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      return res.status(400).json({
        message: "Coupon code already exists",
        error: true,
        success: false,
      });
    }

    // Validate dates
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    
    if (endDate <= startDate) {
      return res.status(400).json({
        message: "End date must be after start date",
        error: true,
        success: false,
      });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      description,
      discount_type,
      discount_value,
      min_order_amount: min_order_amount || 0,
      max_discount_amount: max_discount_amount || null,
      start_date: startDate,
      end_date: endDate,
      usage_limit: usage_limit || null,
      applicable_categories: applicable_categories || [],
      excluded_products: excluded_products || [],
      user_specific: user_specific || false,
      allowed_users: allowed_users || [],
      created_by: req.user._id,
    });

    await coupon.populate([
      { path: "applicable_categories", select: "name" },
      { path: "excluded_products", select: "name" },
      { path: "created_by", select: "name email" }
    ]);

    res.status(201).json({
      message: "Coupon created successfully",
      success: true,
      error: false,
      data: coupon,
    });
  } catch (error) {
    console.error("Create coupon error:", error);
    res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
};

// @desc    Validate coupon
// @route   POST /api/coupons/validate
// @access  Private
export const validateCoupon = async (req, res) => {
  try {
    const { code, cartId } = req.body;

    // Find coupon
    const coupon = await Coupon.findOne({ code: code.toUpperCase() })
      .populate("applicable_categories", "name")
      .populate("excluded_products", "name price");

    if (!coupon) {
      return res.status(400).json({
        message: "Invalid coupon code",
        error: true,
        success: false,
      });
    }

    // Check if user exists (for authenticated routes)
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        message: "Authentication required",
        error: true,
        success: false,
      });
    }

    // Check coupon availability
    const now = new Date();
    const isAvailable = coupon.is_active && 
                       coupon.start_date <= now && 
                       coupon.end_date >= now &&
                       (!coupon.usage_limit || coupon.used_count < coupon.usage_limit);

    if (!isAvailable) {
      return res.status(400).json({
        message: "Coupon is not available",
        error: true,
        success: false,
      });
    }

    // Check user-specific restrictions
    if (coupon.user_specific && !coupon.allowed_users.includes(req.user._id)) {
      return res.status(400).json({
        message: "Coupon is not valid for your account",
        error: true,
        success: false,
      });
    }

    // Get cart to validate conditions
    const cart = await Cart.findOne({ _id: cartId, user: req.user._id })
      .populate({
        path: "items.product",
        select: "name price category"
      });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
        error: true,
        success: false,
      });
    }

    // Check minimum order amount
    if (cart.totalAmount < coupon.min_order_amount) {
      return res.status(400).json({
        message: `Minimum order amount of ₹${coupon.min_order_amount} required`,
        error: true,
        success: false,
      });
    }

    // Check category and product restrictions
    let applicableItems = cart.items;
    
    if (coupon.applicable_categories && coupon.applicable_categories.length > 0) {
      applicableItems = cart.items.filter(item => 
        coupon.applicable_categories.some(cat => 
          cat._id && cat._id.equals(item.product.category)
        )
      );
    }

    if (coupon.excluded_products && coupon.excluded_products.length > 0) {
      applicableItems = applicableItems.filter(item =>
        !coupon.excluded_products.some(excluded =>
          excluded._id && excluded._id.equals(item.product._id)
        )
      );
    }

    if (applicableItems.length === 0) {
      return res.status(400).json({
        message: "Coupon not applicable to any items in cart",
        error: true,
        success: false,
      });
    }

    // Calculate applicable amount
    const applicableAmount = applicableItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);

    // Calculate discount
    let discountAmount = 0;
    
    if (coupon.discount_type === "percentage") {
      discountAmount = (applicableAmount * coupon.discount_value) / 100;
      if (coupon.max_discount_amount && discountAmount > coupon.max_discount_amount) {
        discountAmount = coupon.max_discount_amount;
      }
    } else {
      discountAmount = Math.min(coupon.discount_value, applicableAmount);
    }

    discountAmount = Math.round(discountAmount * 100) / 100;

    res.status(200).json({
      message: "Coupon validated successfully",
      success: true,
      error: false,
      data: {
        coupon: {
          _id: coupon._id,
          code: coupon.code,
          description: coupon.description,
          discount_type: coupon.discount_type,
          discount_value: coupon.discount_value,
          max_discount_amount: coupon.max_discount_amount,
        },
        discount_amount: discountAmount,
        applicable_amount: applicableAmount,
        final_amount: cart.totalAmount - discountAmount,
      },
    });
  } catch (error) {
    console.error("Validate coupon error:", error);
    res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
};

// @desc    Update coupon (Admin)
// @route   PUT /api/coupons/:id
// @access  Private/Admin
export const updateCoupon = async (req, res) => {
  try {
    let coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        message: "Coupon not found",
        error: true,
        success: false,
      });
    }

    // Handle nullable fields
    const updateData = { ...req.body };
    
    // Convert empty strings or undefined to null for optional fields
    const nullableFields = ['max_discount_amount', 'usage_limit'];
    nullableFields.forEach(field => {
      if (updateData[field] === '' || updateData[field] === undefined) {
        updateData[field] = null;
      }
    });

    // Ensure min_order_amount is at least 0
    if (updateData.min_order_amount === '' || updateData.min_order_amount === undefined) {
      updateData.min_order_amount = 0;
    }

    // If updating code, check for duplicates
    if (updateData.code && updateData.code.toUpperCase() !== coupon.code) {
      const existingCoupon = await Coupon.findOne({ 
        code: updateData.code.toUpperCase(),
        _id: { $ne: req.params.id }
      });
      if (existingCoupon) {
        return res.status(400).json({
          message: "Coupon code already exists",
          error: true,
          success: false,
        });
      }
      updateData.code = updateData.code.toUpperCase();
    }

    // Validate dates if both are provided
    if (updateData.start_date && updateData.end_date) {
      const startDate = new Date(updateData.start_date);
      const endDate = new Date(updateData.end_date);
      if (endDate <= startDate) {
        return res.status(400).json({
          message: "End date must be after start date",
          error: true,
          success: false,
        });
      }
    }

    coupon = await Coupon.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true, runValidators: true }
    )
    .populate("applicable_categories", "name")
    .populate("excluded_products", "name")
    .populate("created_by", "name email")
    .populate("allowed_users", "name email");

    res.status(200).json({
      message: "Coupon updated successfully",
      success: true,
      error: false,
      data: coupon,
    });
  } catch (error) {
    console.error("Update coupon error:", error);
    res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
};

// @desc    Delete coupon (Admin)
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        message: "Coupon not found",
        error: true,
        success: false,
      });
    }

    await coupon.deleteOne();

    res.status(200).json({
      message: "Coupon deleted successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Delete coupon error:", error);
    res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
};

// @desc    Toggle coupon status (Admin)
// @route   PUT /api/coupons/:id/toggle
// @access  Private/Admin
export const toggleCouponStatus = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        message: "Coupon not found",
        error: true,
        success: false,
      });
    }

    coupon.is_active = !coupon.is_active;
    await coupon.save();

    res.status(200).json({
      message: `Coupon ${coupon.is_active ? 'activated' : 'deactivated'} successfully`,
      success: true,
      error: false,
      data: coupon,
    });
  } catch (error) {
    console.error("Toggle coupon status error:", error);
    res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
};

// @desc    Bulk delete coupons (Admin)
// @route   DELETE /api/coupons/bulk
// @access  Private/Admin
export const bulkDeleteCoupons = async (req, res) => {
  try {
    const { couponIds } = req.body;

    if (!couponIds || !Array.isArray(couponIds) || couponIds.length === 0) {
      return res.status(400).json({
        message: "Please provide an array of coupon IDs",
        error: true,
        success: false,
      });
    }

    const result = await Coupon.deleteMany({ _id: { $in: couponIds } });

    res.status(200).json({
      message: `${result.deletedCount} coupons deleted successfully`,
      success: true,
      error: false,
      data: { deletedCount: result.deletedCount },
    });
  } catch (error) {
    console.error("Bulk delete coupons error:", error);
    res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
};

// @desc    Bulk update coupon status (Admin)
// @route   PUT /api/coupons/bulk/status
// @access  Private/Admin
export const bulkUpdateCouponStatus = async (req, res) => {
  try {
    const { couponIds, is_active } = req.body;

    if (!couponIds || !Array.isArray(couponIds) || couponIds.length === 0) {
      return res.status(400).json({
        message: "Please provide an array of coupon IDs",
        error: true,
        success: false,
      });
    }

    if (typeof is_active !== 'boolean') {
      return res.status(400).json({
        message: "Please provide a valid is_active value (boolean)",
        error: true,
        success: false,
      });
    }

    const result = await Coupon.updateMany(
      { _id: { $in: couponIds } },
      { is_active }
    );

    res.status(200).json({
      message: `${result.modifiedCount} coupons updated successfully`,
      success: true,
      error: false,
      data: { modifiedCount: result.modifiedCount },
    });
  } catch (error) {
    console.error("Bulk update coupon status error:", error);
    res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
};

// @desc    Get coupon statistics (Admin)
// @route   GET /api/coupons/stats
// @access  Private/Admin
export const getCouponStats = async (req, res) => {
  try {
    const now = new Date();
    
    const totalCoupons = await Coupon.countDocuments();
    const activeCoupons = await Coupon.countDocuments({
      is_active: true,
      start_date: { $lte: now },
      end_date: { $gte: now }
    });
    const expiredCoupons = await Coupon.countDocuments({
      end_date: { $lt: now }
    });
    
    const usageStats = await Coupon.aggregate([
      {
        $group: {
          _id: null,
          totalUsed: { $sum: "$used_count" },
          avgUsage: { $avg: "$used_count" }
        }
      }
    ]);

    res.status(200).json({
      message: "Coupon stats fetched successfully",
      success: true,
      error: false,
      data: {
        total: totalCoupons,
        active: activeCoupons,
        expired: expiredCoupons,
        totalUsed: usageStats[0]?.totalUsed || 0,
        averageUsage: Math.round(usageStats[0]?.avgUsage || 0)
      }
    });
  } catch (error) {
    console.error("Get coupon stats error:", error);
    res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
};

// @desc    Apply coupon to cart
// @route   POST /api/cart/apply-coupon
// @access  Private
export const applyCouponToCart = async (req, res) => {
  try {
    const { code } = req.body;
    const userId = req.user._id;

    if (!code) {
      return res.status(400).json({
        message: "Coupon code is required",
        error: true,
        success: false,
      });
    }

    // Find the coupon
    const coupon = await Coupon.findOne({ 
      code: code.toUpperCase(),
      is_active: true 
    });

    if (!coupon) {
      return res.status(400).json({
        message: "Invalid coupon code",
        error: true,
        success: false,
      });
    }

    // Check if coupon is available
    const now = new Date();
    if (coupon.start_date > now || coupon.end_date < now) {
      return res.status(400).json({
        message: "Coupon has expired or not yet active",
        error: true,
        success: false,
      });
    }

    // Check usage limit
    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
      return res.status(400).json({
        message: "Coupon usage limit has been reached",
        error: true,
        success: false,
      });
    }

    // Check user-specific restriction
    if (coupon.user_specific && !coupon.allowed_users.includes(userId)) {
      return res.status(400).json({
        message: "This coupon is not valid for your account",
        error: true,
        success: false,
      });
    }

    // Find user's cart
    const cart = await Cart.findOne({ user: userId }).populate({
      path: "items.product",
      select: "name price category stock"
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
        error: true,
        success: false,
      });
    }

    // Calculate subtotal
    const subtotal = cart.items.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);

    // Check minimum order amount
    if (subtotal < coupon.min_order_amount) {
      return res.status(400).json({
        message: `Minimum order amount of ₹${coupon.min_order_amount} required`,
        error: true,
        success: false,
      });
    }

    // Check category and product restrictions
    let applicableItems = cart.items;
    
    // Filter by applicable categories
    if (coupon.applicable_categories && coupon.applicable_categories.length > 0) {
      applicableItems = cart.items.filter(item => 
        coupon.applicable_categories.some(catId => 
          catId.toString() === item.product.category?.toString()
        )
      );
    }

    // Filter out excluded products
    if (coupon.excluded_products && coupon.excluded_products.length > 0) {
      applicableItems = applicableItems.filter(item =>
        !coupon.excluded_products.some(excludedId =>
          excludedId.toString() === item.product._id.toString()
        )
      );
    }

    if (applicableItems.length === 0) {
      return res.status(400).json({
        message: "Coupon not applicable to any items in your cart",
        error: true,
        success: false,
      });
    }

    // Calculate applicable amount
    const applicableAmount = applicableItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);

    // Calculate discount
    let discountAmount = 0;
    
    if (coupon.discount_type === "percentage") {
      discountAmount = (applicableAmount * coupon.discount_value) / 100;
      if (coupon.max_discount_amount && discountAmount > coupon.max_discount_amount) {
        discountAmount = coupon.max_discount_amount;
      }
    } else {
      discountAmount = Math.min(coupon.discount_value, applicableAmount);
    }

    discountAmount = Math.round(discountAmount * 100) / 100;

    // Update cart with coupon
    cart.couponCode = coupon.code;
    cart.discountAmount = discountAmount;
    await cart.save();

    // Populate cart for response
    await cart.populate({
      path: "items.product",
      select: "name price images stock"
    });

    res.status(200).json({
      message: "Coupon applied successfully",
      success: true,
      error: false,
      data: cart
    });

  } catch (error) {
    console.error("Apply coupon error:", error);
    res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
};

// @desc    Remove coupon from cart
// @route   DELETE /api/cart/remove-coupon
// @access  Private
export const removeCouponFromCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
        error: true,
        success: false,
      });
    }

    // Remove coupon from cart
    cart.couponCode = null;
    cart.discountAmount = 0;
    await cart.save();

    // Populate cart for response
    await cart.populate({
      path: "items.product",
      select: "name price images stock"
    });

    res.status(200).json({
      message: "Coupon removed successfully",
      success: true,
      error: false,
      data: cart
    });

  } catch (error) {
    console.error("Remove coupon error:", error);
    res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
};