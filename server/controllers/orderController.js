import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Coupon from "../models/Coupon.js";
import Address from "../models/Address.js";

// @desc    Create order from cart
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const { shippingAddressId, billingAddressId, paymentMethod, couponCode } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user.id })
      .populate("items.product", "name price images stock");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Cart is empty",
      });
    }

    // Verify stock availability
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          error: true,
          message: `Insufficient stock for ${item.product.name}. Only ${item.product.stock} available.`,
        });
      }
    }

    // Get addresses
    const shippingAddress = await Address.findOne({
      _id: shippingAddressId,
      user: req.user.id,
    });

    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Shipping address not found",
      });
    }

    const billingAddress = billingAddressId 
      ? await Address.findOne({ _id: billingAddressId, user: req.user.id })
      : shippingAddress;

    // Calculate totals
    let subtotal = cart.totalAmount;
    let discountAmount = cart.discountAmount || 0;
    let shippingCharge = calculateShippingCharge(subtotal);
    let taxAmount = calculateTaxAmount(subtotal);
    let totalAmount = subtotal + shippingCharge + taxAmount - discountAmount;

    // Validate coupon if provided
    let couponApplied = null;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
      
      if (coupon && coupon.is_available) {
        // Recalculate discount for order validation
        if (coupon.discount_type === "percentage") {
          discountAmount = (subtotal * coupon.discount_value) / 100;
          if (coupon.max_discount_amount && discountAmount > coupon.max_discount_amount) {
            discountAmount = coupon.max_discount_amount;
          }
        } else {
          discountAmount = Math.min(coupon.discount_value, subtotal);
        }
        
        discountAmount = Math.round(discountAmount * 100) / 100;
        totalAmount = subtotal + shippingCharge + taxAmount - discountAmount;
        couponApplied = coupon._id;

        // Increment coupon usage
        coupon.used_count += 1;
        await coupon.save();
      }
    }

    // Prepare order items
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.price,
      name: item.product.name,
      image: item.product.images[0]?.url || "",
    }));

    // Create order
    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      shipping_address: shippingAddress._id,
      billing_address: billingAddress._id,
      payment_method: paymentMethod,
      subtotal,
      shipping_charge: shippingCharge,
      tax_amount: taxAmount,
      discount_amount: discountAmount,
      total_amount: totalAmount,
      coupon_applied: couponApplied,
    });

    // Update product stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(
        item.product._id,
        { $inc: { stock: -item.quantity } }
      );
    }

    // Clear cart
    cart.items = [];
    cart.couponCode = null;
    cart.discountAmount = 0;
    cart.totalAmount = 0;
    cart.finalAmount = 0;
    await cart.save();

    await order.populate("shipping_address");
    await order.populate("billing_address");
    await order.populate("items.product", "name images");

    res.status(201).json({
      success: true,
      data: order,
      message: "Order created successfully",
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({
      success: false,
      error: true,
      message: "Server error",
    });
  }
};

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
export const getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    let filter = { user: req.user.id };
    if (status) {
      filter.order_status = status;
    }

    const orders = await Order.find(filter)
      .populate("items.product", "name images")
      .populate("shipping_address")
      .sort("-createdAt")
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalOrders: total,
      },
    });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({
      success: false,
      error: true,
      message: "Server error",
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.product", "name images description")
      .populate("shipping_address")
      .populate("billing_address")
      .populate("coupon_applied", "code description");

    if (!order) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Order not found",
      });
    }

    // Verify user owns the order
    if (order.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: true,
        message: "Not authorized to view this order",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({
      success: false,
      error: true,
      message: "Server error",
    });
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingNumber, shippingCarrier, notes } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Order not found",
      });
    }

    order.order_status = status;
    
    if (trackingNumber) order.tracking_number = trackingNumber;
    if (shippingCarrier) order.shipping_carrier = shippingCarrier;
    if (notes) order.notes = notes;

    // Set expected delivery for shipped orders
    if (status === "shipped") {
      order.expected_delivery = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
    }

    await order.save();

    await order.populate("user", "name email");

    // TODO: Send status update email/notification

    res.status(200).json({
      success: true,
      data: order,
      message: "Order status updated successfully",
    });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({
      success: false,
      error: true,
      message: "Server error",
    });
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req, res) => {
  try {
    const { reason } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Order not found",
      });
    }

    // Verify user owns the order
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: true,
        message: "Not authorized to cancel this order",
      });
    }

    // Check if order can be cancelled
    if (!["pending", "confirmed"].includes(order.order_status)) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Order cannot be cancelled at this stage",
      });
    }

    order.order_status = "cancelled";
    order.cancellation_reason = reason || "";

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } }
      );
    }

    await order.save();

    res.status(200).json({
      success: true,
      data: order,
      message: "Order cancelled successfully",
    });
  } catch (error) {
    console.error("Cancel order error:", error);
    res.status(500).json({
      success: false,
      error: true,
      message: "Server error",
    });
  }
};

// @desc    Get order statistics
// @route   GET /api/orders/stats
// @access  Private/Admin
export const getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ order_status: "pending" });
    const completedOrders = await Order.countDocuments({ order_status: "delivered" });
    
    const revenue = await Order.aggregate([
      { $match: { order_status: "delivered" } },
      { $group: { _id: null, total: { $sum: "$total_amount" } } }
    ]);

    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          order_status: "delivered",
          createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
        }
      },
      { $group: { _id: null, total: { $sum: "$total_amount" } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        completedOrders,
        totalRevenue: revenue[0]?.total || 0,
        monthlyRevenue: monthlyRevenue[0]?.total || 0,
      },
    });
  } catch (error) {
    console.error("Get order stats error:", error);
    res.status(500).json({
      success: false,
      error: true,
      message: "Server error",
    });
  }
};

// Helper functions
const calculateShippingCharge = (subtotal) => {
  if (subtotal > 1000) return 0; // Free shipping above ₹1000
  return 50; // Flat ₹50 shipping
};

const calculateTaxAmount = (subtotal) => {
  return subtotal * 0.18; // 18% GST
};