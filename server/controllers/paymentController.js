// controllers/paymentController.js
import crypto from "crypto";
import Stripe from "stripe";
import Razorpay from "razorpay";
import Payment from "../models/Payment.js";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// @desc    Create payment intent (Stripe)
// @route   POST /api/payments/create-intent
// @access  Private
export const createPaymentIntent = async (req, res) => {
  try {
    const { orderId, paymentMethod } = req.body;

    const order = await Order.findById(orderId).populate("user", "email name");
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Order not found",
      });
    }

    // Verify order belongs to user
    if (order.user._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: true,
        message: "Not authorized to pay for this order",
      });
    }

    // Check if order is already paid
    if (order.payment_status === "completed") {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Order is already paid",
      });
    }

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.total_amount * 100),
      currency: "inr",
      payment_method_types: ["card"],
      metadata: {
        order_id: order._id.toString(),
        user_id: req.user.id,
      },
      description: `Payment for order ${order.order_id}`,
    });

    // Create payment record
    const payment = await Payment.create({
      order: order._id,
      user: req.user.id,
      payment_id: paymentIntent.id,
      payment_method: paymentMethod || "card",
      payment_gateway: "stripe",
      amount: order.total_amount,
      currency: "INR",
      status: "pending",
      gateway_response: paymentIntent,
    });

    res.status(200).json({
      success: true,
      data: {
        client_secret: paymentIntent.client_secret,
        payment_id: payment._id,
        payment_intent_id: paymentIntent.id,
      },
    });
  } catch (error) {
    console.error("Create payment intent error:", error);
    res.status(500).json({
      success: false,
      error: true,
      message: "Payment processing error",
    });
  }
};

// @desc    Create Razorpay order
// @route   POST /api/payments/create-razorpay-order
// @access  Private
// controllers/paymentController.js
export const createRazorpayOrder = async (req, res) => {
  try {
    const { orderId, paymentMethod } = req.body;

    console.log("Creating Razorpay order for:", { orderId, paymentMethod }); // Add debug log

    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Order not found",
      });
    }

    // Verify order belongs to user
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: true,
        message: "Not authorized to pay for this order",
      });
    }

    // Check if order is already paid
    if (order.payment_status === "completed") {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Order is already paid",
      });
    }

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(order.total_amount * 100),
      currency: "INR",
      receipt: order.order_id,
      notes: {
        order_id: order._id.toString(),
        user_id: req.user.id,
      },
    });

    console.log("Razorpay order created:", razorpayOrder); // Debug log

    // Create payment record
    const payment = await Payment.create({
      order: order._id,
      user: req.user.id,
      razorpay_order_id: razorpayOrder.id, // Make sure your Payment model has this field
      payment_id: razorpayOrder.id, // Or use a temporary ID
      payment_method: paymentMethod || "upi",
      payment_gateway: "razorpay",
      amount: order.total_amount,
      currency: "INR",
      status: "pending",
      gateway_response: razorpayOrder,
    });

    res.status(200).json({
      success: true,
      data: {
        id: razorpayOrder.id,
        order_id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.RAZORPAY_KEY_ID,
        payment_id: payment._id,
      },
    });
  } catch (error) {
    console.error("Create Razorpay order error:", error); // This will show the actual error
    
    // Send more detailed error message
    res.status(500).json({
      success: false,
      error: true,
      message: error.message || "Payment processing error",
      details: error.error || error,
    });
  }
};

// @desc    Confirm payment
// @route   POST /api/payments/confirm
// @access  Private
export const confirmPayment = async (req, res) => {
  try {
    const { paymentId, gateway, paymentData } = req.body;

    const payment = await Payment.findById(paymentId).populate("order");
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Payment not found",
      });
    }

    // Verify payment belongs to user
    if (payment.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: true,
        message: "Not authorized to confirm this payment",
      });
    }

    // Check if already completed
    if (payment.status === "completed") {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Payment already completed",
      });
    }

    let verified = false;
    let capturedPayment;
    let paymentDetails = {};

    if (gateway === "stripe") {
      // Verify Stripe payment
      capturedPayment = await stripe.paymentIntents.retrieve(paymentData.paymentIntentId);
      verified = capturedPayment.status === "succeeded";
      
      if (verified) {
        paymentDetails = {
          payment_id: paymentData.paymentIntentId,
        };
      }
    } else if (gateway === "razorpay") {
      // Verify Razorpay payment signature
      const {
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
        razorpay_payment_method
      } = paymentData;

      // Generate signature for verification
      const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest("hex");

      verified = generatedSignature === razorpay_signature;
      
      if (verified) {
        // Fetch payment details from Razorpay
        capturedPayment = await razorpay.payments.fetch(razorpay_payment_id);
        
        paymentDetails = {
          payment_id: razorpay_payment_id,
          razorpay_order_id: razorpay_order_id,
          payment_method: razorpay_payment_method || capturedPayment.method,
        };
      }
    }

    if (verified) {
      // Update payment status
      payment.status = "completed";
      payment.payment_id = paymentDetails.payment_id || payment.payment_id;
      if (paymentDetails.razorpay_order_id) {
        payment.razorpay_order_id = paymentDetails.razorpay_order_id;
      }
      if (paymentDetails.payment_method) {
        payment.payment_method = paymentDetails.payment_method;
      }
      payment.gateway_response = capturedPayment || paymentData;
      payment.captured_at = new Date();
      await payment.save();

      // Update order status
      const order = payment.order;
      order.payment_status = "completed";
      order.payment_id = payment.payment_id;
      order.order_status = "confirmed";
      order.paid_at = new Date();
      await order.save();

      // Clear user's cart
      await Cart.findOneAndUpdate(
        { user: req.user.id },
        { items: [], couponCode: null, discountAmount: 0, totalAmount: 0 }
      );

      res.status(200).json({
        success: true,
        data: {
          payment,
          order,
        },
        message: "Payment confirmed successfully",
      });
    } else {
      // Payment failed
      payment.status = "failed";
      payment.gateway_response = paymentData;
      await payment.save();

      // Update order status
      const order = payment.order;
      order.payment_status = "failed";
      await order.save();

      res.status(400).json({
        success: false,
        error: true,
        message: "Payment verification failed",
      });
    }
  } catch (error) {
    console.error("Confirm payment error:", error);
    res.status(500).json({
      success: false,
      error: true,
      message: "Payment confirmation error",
    });
  }
};

// @desc    Razorpay webhook
// @route   POST /api/payments/webhook/razorpay
// @access  Public
export const razorpayWebhook = async (req, res) => {
  try {
    // Verify webhook signature (optional but recommended)
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];
    
    if (webhookSecret && signature) {
      const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(JSON.stringify(req.body))
        .digest("hex");
      
      if (expectedSignature !== signature) {
        return res.status(400).json({ 
          success: false,
          error: true,
          message: "Invalid signature" 
        });
      }
    }

    const event = req.body;
    console.log("Razorpay webhook event:", event.event);

    // Handle payment captured event
    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;
      
      // Find payment by razorpay_order_id
      const existingPayment = await Payment.findOne({ 
        razorpay_order_id: payment.order_id 
      }).populate("order");

      if (existingPayment) {
        // Update payment record
        existingPayment.status = "completed";
        existingPayment.payment_id = payment.id;
        existingPayment.captured_at = new Date();
        existingPayment.payment_method = payment.method;
        existingPayment.gateway_response = payment;
        await existingPayment.save();

        // Update order status
        if (existingPayment.order) {
          existingPayment.order.payment_status = "completed";
          existingPayment.order.payment_id = payment.id;
          existingPayment.order.order_status = "confirmed";
          existingPayment.order.paid_at = new Date();
          await existingPayment.order.save();

          // Clear user's cart
          await Cart.findOneAndUpdate(
            { user: existingPayment.user },
            { items: [], couponCode: null, discountAmount: 0, totalAmount: 0 }
          );
        }

        console.log(`Payment ${payment.id} processed successfully`);
      } else {
        console.log(`No pending payment found for order: ${payment.order_id}`);
      }
    }
    
    // Handle payment failed event
    else if (event.event === "payment.failed") {
      const payment = event.payload.payment.entity;
      
      const existingPayment = await Payment.findOne({ 
        razorpay_order_id: payment.order_id 
      }).populate("order");

      if (existingPayment) {
        existingPayment.status = "failed";
        existingPayment.gateway_response = payment;
        await existingPayment.save();

        if (existingPayment.order) {
          existingPayment.order.payment_status = "failed";
          await existingPayment.order.save();
        }

        console.log(`Payment failed for order: ${payment.order_id}`);
      }
    }

    res.json({ 
      success: true,
      received: true 
    });
  } catch (error) {
    console.error("Razorpay webhook error:", error);
    res.status(500).json({
      success: false,
      error: true,
      message: "Webhook processing error",
    });
  }
};

// @desc    Stripe webhook
// @route   POST /api/payments/webhook/stripe
// @access  Public
export const stripeWebhook = async (req, res) => {
  try {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      
      const payment = await Payment.findOneAndUpdate(
        { payment_id: paymentIntent.id },
        {
          status: "completed",
          captured_at: new Date(),
          gateway_response: paymentIntent,
        },
        { new: true }
      ).populate("order");

      if (payment && payment.order) {
        payment.order.payment_status = "completed";
        payment.order.order_status = "confirmed";
        payment.order.paid_at = new Date();
        await payment.order.save();

        // Clear user's cart
        await Cart.findOneAndUpdate(
          { user: payment.user },
          { items: [], couponCode: null, discountAmount: 0, totalAmount: 0 }
        );
      }
    } else if (event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object;
      
      const payment = await Payment.findOneAndUpdate(
        { payment_id: paymentIntent.id },
        {
          status: "failed",
          gateway_response: paymentIntent,
        },
        { new: true }
      ).populate("order");

      if (payment && payment.order) {
        payment.order.payment_status = "failed";
        await payment.order.save();
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    res.status(500).json({
      success: false,
      error: true,
      message: "Webhook processing error",
    });
  }
};

// @desc    Get payment details
// @route   GET /api/payments/:id
// @access  Private
export const getPaymentDetails = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("order")
      .populate("user", "name email phone");

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Payment not found",
      });
    }

    // Verify user owns the payment or is admin
    if (payment.user._id.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: true,
        message: "Not authorized to view this payment",
      });
    }

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    console.error("Get payment details error:", error);
    res.status(500).json({
      success: false,
      error: true,
      message: "Server error",
    });
  }
};

// @desc    Get user payments
// @route   GET /api/payments/user/my-payments
// @access  Private
export const getMyPayments = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = { user: req.user.id };
    if (status) {
      query.status = status;
    }

    const payments = await Payment.find(query)
      .populate("order", "order_id total_amount order_status")
      .sort("-createdAt")
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Payment.countDocuments(query);

    res.status(200).json({
      success: true,
      data: payments,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalPayments: total,
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Get my payments error:", error);
    res.status(500).json({
      success: false,
      error: true,
      message: "Server error",
    });
  }
};

// @desc    Verify Razorpay payment (alternative to confirm endpoint)
// @route   POST /api/payments/verify-razorpay
// @access  Private
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      order_id // Your internal order ID
    } = req.body;

    // Find payment by razorpay_order_id
    const payment = await Payment.findOne({ 
      razorpay_order_id: razorpay_order_id 
    }).populate("order");

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Payment not found",
      });
    }

    // Verify signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Invalid signature",
      });
    }

    // Fetch payment details from Razorpay
    const capturedPayment = await razorpay.payments.fetch(razorpay_payment_id);

    // Update payment status
    payment.status = "completed";
    payment.payment_id = razorpay_payment_id;
    payment.captured_at = new Date();
    payment.payment_method = capturedPayment.method;
    payment.gateway_response = capturedPayment;
    await payment.save();

    // Update order status
    const order = payment.order;
    order.payment_status = "completed";
    order.payment_id = razorpay_payment_id;
    order.order_status = "confirmed";
    order.paid_at = new Date();
    await order.save();

    // Clear user's cart
    await Cart.findOneAndUpdate(
      { user: req.user.id },
      { items: [], couponCode: null, discountAmount: 0, totalAmount: 0 }
    );

    res.status(200).json({
      success: true,
      data: {
        payment,
        order,
      },
      message: "Payment verified successfully",
    });
  } catch (error) {
    console.error("Verify Razorpay payment error:", error);
    res.status(500).json({
      success: false,
      error: true,
      message: "Payment verification error",
    });
  }
};