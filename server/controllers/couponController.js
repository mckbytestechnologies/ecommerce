import Coupon from "../models/Coupon.js";
import Cart from "../models/Cart.js";

// @desc    Get all coupons (Admin)
// @route   GET /api/coupons
// @access  Private/Admin
export const getCoupons = async (req, res) => {
  try {
    const { page = 1, limit = 10, active } = req.query;
    
    let filter = {};
    if (active === "true") {
      filter = {
        is_active: true,
        start_date: { $lte: new Date() },
        end_date: { $gte: new Date() },
      };
    }

    const coupons = await Coupon.find(filter)
      .populate("created_by", "name email")
      .populate("applicable_categories", "name")
      .populate("excluded_products", "name")
      .sort("-createdAt")
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Coupon.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: coupons,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalCoupons: total,
      },
    });
  } catch (error) {
    console.error("Get coupons error:", error);
    res.status(500).json({
      success: false,
      error: true,
      message: "Server error",
    });
  }
};

// @desc    Get active coupons for user
// @route   GET /api/coupons/active
// @access  Private
export const getActiveCoupons = async (req, res) => {
  try {
    const now = new Date();
    
    const coupons = await Coupon.find({
      is_active: true,
      start_date: { $lte: now },
      end_date: { $gte: now },
      $or: [
        { user_specific: false },
        { user_specific: true, allowed_users: req.user.id }
      ],
      $or: [
        { usage_limit: null },
        { usage_limit: { $gt: { $expr: "$used_count" } } }
      ]
    })
    .populate("applicable_categories", "name")
    .select("-allowed_users -created_by")
    .sort("-discount_value");

    res.status(200).json({
      success: true,
      data: coupons,
    });
  } catch (error) {
    console.error("Get active coupons error:", error);
    res.status(500).json({
      success: false,
      error: true,
      message: "Server error",
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
        success: false,
        error: true,
        message: "Coupon code already exists",
      });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      description,
      discount_type,
      discount_value,
      min_order_amount: min_order_amount || 0,
      max_discount_amount: max_discount_amount || null,
      start_date: new Date(start_date),
      end_date: new Date(end_date),
      usage_limit: usage_limit || null,
      applicable_categories: applicable_categories || [],
      excluded_products: excluded_products || [],
      user_specific: user_specific || false,
      allowed_users: allowed_users || [],
      created_by: req.user.id,
    });

    await coupon.populate("applicable_categories", "name");
    await coupon.populate("excluded_products", "name");

    res.status(201).json({
      success: true,
      data: coupon,
      message: "Coupon created successfully",
    });
  } catch (error) {
    console.error("Create coupon error:", error);
    res.status(500).json({
      success: false,
      error: true,
      message: "Server error",
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
        success: false,
        error: true,
        message: "Invalid coupon code",
      });
    }

    // Check coupon availability
    if (!coupon.is_available) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Coupon is not available",
      });
    }

    // Check user-specific restrictions
    if (coupon.user_specific && !coupon.allowed_users.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Coupon is not valid for your account",
      });
    }

    // Get cart to validate conditions
    const cart = await Cart.findOne({ _id: cartId, user: req.user.id })
      .populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Cart is empty",
      });
    }

    // Check minimum order amount
    if (cart.totalAmount < coupon.min_order_amount) {
      return res.status(400).json({
        success: false,
        error: true,
        message: `Minimum order amount of ₹${coupon.min_order_amount} required`,
      });
    }

    // Check category and product restrictions
    let applicableItems = cart.items;
    
    if (coupon.applicable_categories.length > 0) {
      applicableItems = cart.items.filter(item => 
        coupon.applicable_categories.some(cat => 
          cat._id.equals(item.product.category)
        )
      );
    }

    if (coupon.excluded_products.length > 0) {
      applicableItems = applicableItems.filter(item =>
        !coupon.excluded_products.some(excluded =>
          excluded._id.equals(item.product._id)
        )
      );
    }

    if (applicableItems.length === 0) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Coupon not applicable to any items in cart",
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
      success: true,
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
      success: false,
      error: true,
      message: "Server error",
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
        success: false,
        error: true,
        message: "Coupon not found",
      });
    }

    // If updating code, check for duplicates
    if (req.body.code && req.body.code !== coupon.code) {
      const existingCoupon = await Coupon.findOne({ 
        code: req.body.code.toUpperCase(),
        _id: { $ne: req.params.id }
      });
      if (existingCoupon) {
        return res.status(400).json({
          success: false,
          error: true,
          message: "Coupon code already exists",
        });
      }
      req.body.code = req.body.code.toUpperCase();
    }

    coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    .populate("applicable_categories", "name")
    .populate("excluded_products", "name");

    res.status(200).json({
      success: true,
      data: coupon,
      message: "Coupon updated successfully",
    });
  } catch (error) {
    console.error("Update coupon error:", error);
    res.status(500).json({
      success: false,
      error: true,
      message: "Server error",
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
        success: false,
        error: true,
        message: "Coupon not found",
      });
    }

    await Coupon.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Coupon deleted successfully",
    });
  } catch (error) {
    console.error("Delete coupon error:", error);
    res.status(500).json({
      success: false,
      error: true,
      message: "Server error",
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
        success: false,
        error: true,
        message: "Coupon not found",
      });
    }

    coupon.is_active = !coupon.is_active;
    await coupon.save();

    res.status(200).json({
      success: true,
      data: coupon,
      message: `Coupon ${coupon.is_active ? 'activated' : 'deactivated'} successfully`,
    });
  } catch (error) {
    console.error("Toggle coupon status error:", error);
    res.status(500).json({
      success: false,
      error: true,
      message: "Server error",
    });
  }
};