import Joi from "joi";
import { body, validationResult, query, param } from "express-validator";

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      error: true,
      success: false,
      errors: errors.array(),
    });
  }
  next();
};

// Auth validation
export const validateRegister = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Password must contain at least one lowercase letter, one uppercase letter, and one number"),
  
  body("mobile")
    .optional()
    .matches(/^[0-9]{10}$/)
    .withMessage("Please provide a valid 10-digit mobile number"),
  
  handleValidationErrors,
];

export const validateLogin = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  
  body("password")
    .notEmpty()
    .withMessage("Password is required"),
  
  handleValidationErrors,
];

// Product validation
export const validateProduct = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ max: 200 })
    .withMessage("Product name cannot exceed 200 characters"),
  
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ max: 2000 })
    .withMessage("Description cannot exceed 2000 characters"),
  
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  
  body("category")
    .isMongoId()
    .withMessage("Valid category ID is required"),
  
  body("stock")
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),
  
  body("brand")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Brand cannot exceed 100 characters"),
  
  handleValidationErrors,
];

// Category validation
export const validateCategory = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ max: 100 })
    .withMessage("Category name cannot exceed 100 characters"),
  
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),
  
  handleValidationErrors,
];

// Review validation
export const validateReview = [
  body("productId")
    .isMongoId()
    .withMessage("Valid product ID is required"),
  
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Review title is required")
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters"),
  
  body("comment")
    .trim()
    .notEmpty()
    .withMessage("Review comment is required")
    .isLength({ max: 1000 })
    .withMessage("Comment cannot exceed 1000 characters"),
  
  handleValidationErrors,
];

// Address validation
export const validateAddress = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Address name is required")
    .isLength({ max: 50 })
    .withMessage("Name cannot exceed 50 characters"),
  
  body("mobile")
    .matches(/^[0-9]{10}$/)
    .withMessage("Please provide a valid 10-digit mobile number"),
  
  body("address_line")
    .trim()
    .notEmpty()
    .withMessage("Address line is required")
    .isLength({ max: 200 })
    .withMessage("Address line cannot exceed 200 characters"),
  
  body("city")
    .trim()
    .notEmpty()
    .withMessage("City is required")
    .isLength({ max: 50 })
    .withMessage("City cannot exceed 50 characters"),
  
  body("state")
    .trim()
    .notEmpty()
    .withMessage("State is required")
    .isLength({ max: 50 })
    .withMessage("State cannot exceed 50 characters"),
  
  body("pincode")
    .matches(/^[1-9][0-9]{5}$/)
    .withMessage("Please provide a valid 6-digit pincode"),
  
  body("address_type")
    .optional()
    .isIn(["home", "work", "other"])
    .withMessage("Address type must be home, work, or other"),
  
  handleValidationErrors,
];

// Order validation
export const validateOrder = [
  body("shippingAddressId")
    .isMongoId()
    .withMessage("Valid shipping address ID is required"),
  
  body("billingAddressId")
    .optional()
    .isMongoId()
    .withMessage("Valid billing address ID is required"),
  
  body("paymentMethod")
    .isIn(["card", "upi", "netbanking", "cod", "wallet"])
    .withMessage("Invalid payment method"),
  
  body("couponCode")
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage("Coupon code cannot exceed 20 characters"),
  
  handleValidationErrors,
];

// Coupon validation
export const validateCoupon = [
  body("code")
    .trim()
    .notEmpty()
    .withMessage("Coupon code is required")
    .isLength({ max: 20 })
    .withMessage("Coupon code cannot exceed 20 characters")
    .matches(/^[A-Z0-9]+$/)
    .withMessage("Coupon code can only contain uppercase letters and numbers"),
  
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Coupon description is required")
    .isLength({ max: 200 })
    .withMessage("Description cannot exceed 200 characters"),
  
  body("discount_type")
    .isIn(["percentage", "fixed"])
    .withMessage("Discount type must be percentage or fixed"),
  
  body("discount_value")
    .isFloat({ min: 0 })
    .withMessage("Discount value must be a positive number"),
  
  body("min_order_amount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Minimum order amount must be a positive number"),
  
  body("max_discount_amount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Maximum discount amount must be a positive number"),
  
  body("start_date")
    .isISO8601()
    .withMessage("Start date must be a valid date"),
  
  body("end_date")
    .isISO8601()
    .withMessage("End date must be a valid date"),
  
  body("usage_limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Usage limit must be a positive integer"),
  
  handleValidationErrors,
];

// Query validation
export const validateProductQuery = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  
  query("minPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Minimum price must be a positive number"),
  
  query("maxPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Maximum price must be a positive number"),
  
  query("category")
    .optional()
    .isMongoId()
    .withMessage("Category must be a valid ID"),
  
  handleValidationErrors,
];

// Cart validation schemas
export const cartValidation = {
  addItem: Joi.object({
    productId: Joi.string().hex().length(24).required(),
    quantity: Joi.number().integer().min(1).max(100).default(1),
  }),

  updateItem: Joi.object({
    quantity: Joi.number().integer().min(1).max(100).required(),
  }),

  applyCoupon: Joi.object({
    couponCode: Joi.string().max(20).required(),
    cartId: Joi.string().hex().length(24).required(),
  }),
};