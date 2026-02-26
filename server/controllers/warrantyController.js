import Warranty from "../models/Warranty.js";
import {
  sendWarrantyEmailToAdmin,
  sendWarrantyEmailToCustomer,
  sendInnovationEmail,
} from "../services/emailService.js";

// @desc    Register new warranty
// @route   POST /api/warranty/register
// @access  Public
export const registerWarranty = async (req, res) => {
  try {
    const { productModel, purchaseDate, firstName, email, mobileNumber } = req.body;

    // Validate 30-day period
    const purchaseDateTime = new Date(purchaseDate);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    if (purchaseDateTime < thirtyDaysAgo) {
      return res.status(400).json({
        success: false,
        message: "Warranty registration must be within 30 days of purchase",
      });
    }

    // Check if already registered
    const existingWarranty = await Warranty.findOne({
      email,
      productModel,
      purchaseDate: purchaseDateTime,
    });

    if (existingWarranty) {
      return res.status(400).json({
        success: false,
        message: "This product has already been registered for warranty",
      });
    }

    // Get IP and user agent
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers["user-agent"];

    // Create warranty registration
    const warranty = await Warranty.create({
      productModel,
      purchaseDate: purchaseDateTime,
      firstName,
      email,
      mobileNumber,
      ipAddress,
      userAgent,
      status: "active", // Auto-activate (or set to "pending" for manual review)
    });

    // Populate warranty end date
    await warranty.populate();

    // Send emails
    try {
      // Send email to admin
      await sendWarrantyEmailToAdmin({
        ...warranty.toObject(),
        registeredAt: warranty.createdAt,
      });

      // Send confirmation email to customer
      await sendWarrantyEmailToCustomer({
        ...warranty.toObject(),
        warrantyEndDate: warranty.warrantyEndDate,
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Don't fail the request if emails fail
    }

    res.status(201).json({
      success: true,
      message: "Warranty registered successfully! Confirmation email sent.",
      data: {
        id: warranty._id,
        productModel: warranty.productModel,
        warrantyEndDate: warranty.warrantyEndDate,
        status: warranty.status,
      },
    });
  } catch (error) {
    console.error("Warranty registration error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to register warranty",
    });
  }
};

// @desc    Submit innovation idea
// @route   POST /api/warranty/innovation
// @access  Public
export const submitInnovation = async (req, res) => {
  try {
    const { firstName, email, message } = req.body;

    if (!firstName || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Send email
    await sendInnovationEmail({ firstName, email, message });

    res.status(200).json({
      success: true,
      message: "Thank you for your innovation idea! We'll review it soon.",
    });
  } catch (error) {
    console.error("Innovation submission error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to submit idea",
    });
  }
};

// @desc    Check warranty status
// @route   POST /api/warranty/check
// @access  Public
export const checkWarranty = async (req, res) => {
  try {
    const { email, productModel } = req.body;

    const warranty = await Warranty.findOne({
      email,
      productModel,
    }).sort({ createdAt: -1 });

    if (!warranty) {
      return res.status(404).json({
        success: false,
        message: "No warranty found for this product",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        productModel: warranty.productModel,
        purchaseDate: warranty.purchaseDate,
        warrantyEndDate: warranty.warrantyEndDate,
        status: warranty.status,
        daysRemaining: Math.ceil(
          (new Date(warranty.warrantyEndDate) - new Date()) / (1000 * 60 * 60 * 24)
        ),
      },
    });
  } catch (error) {
    console.error("Warranty check error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to check warranty",
    });
  }
};

// @desc    Get all warranties (Admin)
// @route   GET /api/warranty/admin/all
// @access  Private/Admin
export const getAllWarranties = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;

    let query = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { productModel: { $regex: search, $options: "i" } },
        { firstName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const warranties = await Warranty.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Warranty.countDocuments(query);

    res.status(200).json({
      success: true,
      data: warranties,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        total,
      },
    });
  } catch (error) {
    console.error("Get warranties error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch warranties",
    });
  }
};