import Joi from 'joi';

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