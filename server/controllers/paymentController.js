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
      amount: Math.round(order.total_amount * 100), // Convert to cents/paisa
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
export const createRazorpayOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

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

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(order.total_amount * 100), // Convert to paisa
      currency: "INR",
      receipt: order.order_id,
      notes: {
        order_id: order._id.toString(),
        user_id: req.user.id,
      },
    });

    // Create payment record
    const payment = await Payment.create({
      order: order._id,
      user: req.user.id,
      payment_id: razorpayOrder.id,
      payment_method: "upi", // Default for Razorpay
      payment_gateway: "razorpay",
      amount: order.total_amount,
      currency: "INR",
      status: "pending",
      gateway_response: razorpayOrder,
    });

    res.status(200).json({
      success: true,
      data: {
        order_id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        payment_id: payment._id,
      },
    });
  } catch (error) {
    console.error("Create Razorpay order error:", error);
    res.status(500).json({
      success: false,
      error: true,
      message: "Payment processing error",
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

    let verified = false;
    let capturedPayment;

    if (gateway === "stripe") {
      // Verify Stripe payment
      capturedPayment = await stripe.paymentIntents.retrieve(paymentData.paymentIntentId);
      verified = capturedPayment.status === "succeeded";
    } else if (gateway === "razorpay") {
      // Verify Razorpay payment
      const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = paymentData;
      
      const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest("hex");

      verified = generatedSignature === razorpay_signature;
      
      if (verified) {
        capturedPayment = await razorpay.payments.fetch(razorpay_payment_id);
      }
    }

    if (verified) {
      // Update payment status
      payment.status = "completed";
      payment.gateway_response = capturedPayment;
      payment.captured_at = new Date();
      await payment.save();

      // Update order status
      const order = payment.order;
      order.payment_status = "completed";
      order.payment_id = payment.payment_id;
      order.order_status = "confirmed";
      await order.save();

      // Clear user's cart
      await Cart.findOneAndUpdate(
        { user: req.user.id },
        { items: [], couponCode: null, discountAmount: 0 }
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

// @desc    Get payment details
// @route   GET /api/payments/:id
// @access  Private
export const getPaymentDetails = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("order")
      .populate("user", "name email");

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
    const { page = 1, limit = 10 } = req.query;

    const payments = await Payment.find({ user: req.user.id })
      .populate("order", "order_id total_amount")
      .sort("-createdAt")
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Payment.countDocuments({ user: req.user.id });

    res.status(200).json({
      success: true,
      data: payments,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalPayments: total,
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

// @desc    Webhook for Stripe payments
// @route   POST /api/payments/webhook/stripe
// @access  Public (called by Stripe)
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
      
      // Update payment and order status
      await Payment.findOneAndUpdate(
        { payment_id: paymentIntent.id },
        {
          status: "completed",
          captured_at: new Date(),
          gateway_response: paymentIntent,
        }
      );

      const payment = await Payment.findOne({ payment_id: paymentIntent.id }).populate("order");
      if (payment && payment.order) {
        payment.order.payment_status = "completed";
        payment.order.order_status = "confirmed";
        await payment.order.save();

        // Clear user's cart
        await Cart.findOneAndUpdate(
          { user: payment.user },
          { items: [], couponCode: null, discountAmount: 0 }
        );
      }
    } else if (event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object;
      
      await Payment.findOneAndUpdate(
        { payment_id: paymentIntent.id },
        {
          status: "failed",
          gateway_response: paymentIntent,
        }
      );

      const payment = await Payment.findOne({ payment_id: paymentIntent.id }).populate("order");
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