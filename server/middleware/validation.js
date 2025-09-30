import { body, validationResult, query, param } from "express-validator";
import Joi from 'joi';

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

// Product validation rules
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
  
  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags must be an array"),
  
  handleValidationErrors,
];

// Category validation rules
export const validateCategory = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ max: 100 })
    .withMessage("Category name cannot exceed 100 characters"),
  
  handleValidationErrors,
];

// Query validation for products
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



export const cartValidation = {
  // Add item to cart
  addItem: Joi.object({
    productId: Joi.string().required(),
    quantity: Joi.number().integer().min(1).default(1)
  }),

  // Update item quantity
  updateItem: Joi.object({
    quantity: Joi.number().integer().min(1).required()
  }),

  // Apply coupon
  applyCoupon: Joi.object({
    couponCode: Joi.string().required()
  })
};