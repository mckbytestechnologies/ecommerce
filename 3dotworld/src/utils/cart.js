import axios from 'axios';


const API_URL = 'https://server-kzwj.onrender.com/api';

const getAuthToken = () => {
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken') || 
         localStorage.getItem('token') || localStorage.getItem('adminAuthToken');
};

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to all requests
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error('Unauthorized access - please login again');
    }
    return Promise.reject(error);
  }
);

// ==================== CART API METHODS ====================

/**
 * Add item to cart
 * @param {string} productId - Product ID
 * @param {number} quantity - Quantity (default: 1)
 * @returns {Promise} - Response with success/error
 */
export const addToCart = async (productId, quantity = 1) => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Please login to add items to cart');
    }

    const response = await api.post('/cart', {
      productId,
      quantity
    });

    return {
      success: true,
      data: response.data,
      message: response.data.message || 'Added to cart successfully!'
    };
  } catch (error) {
    console.error('Add to cart error:', error);
    
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to add to cart',
      error: error.response?.data
    };
  }
};

/**
 * Get user's cart
 * @returns {Promise} - Cart data
 */
export const getCart = async () => {
  try {
    const response = await api.get('/cart');
    return response.data;
  } catch (error) {
    console.error('Get cart error:', error);
    throw error;
  }
};

/**
 * Remove item from cart
 * @param {string} itemId - Cart item ID
 * @returns {Promise} - Updated cart
 */
export const removeFromCart = async (itemId) => {
  try {
    const response = await api.delete(`/cart/${itemId}`);
    return response.data;
  } catch (error) {
    console.error('Remove from cart error:', error);
    throw error;
  }
};

/**
 * Update cart item quantity
 * @param {string} itemId - Cart item ID
 * @param {number} quantity - New quantity
 * @returns {Promise} - Updated cart
 */
export const updateCartQuantity = async (itemId, quantity) => {
  try {
    const response = await api.put(`/cart/${itemId}`, { quantity });
    return response.data;
  } catch (error) {
    console.error('Update cart error:', error);
    throw error;
  }
};

/**
 * Clear entire cart
 * @returns {Promise} - Empty cart response
 */
export const clearCart = async () => {
  try {
    const response = await api.delete('/cart');
    return response.data;
  } catch (error) {
    console.error('Clear cart error:', error);
    throw error;
  }
};

/**
 * Apply coupon to cart
 * @param {string} code - Coupon code
 * @returns {Promise} - Updated cart with discount
 */
export const applyCoupon = async (code) => {
  try {
    console.log('%c🔍 COUPON DEBUG - Applying coupon:', 'background: #FF4757; color: white; font-size: 12px; padding: 4px;', {
      originalCode: code,
      uppercaseCode: code?.toUpperCase(),
      token: getAuthToken() ? 'Present (starts with: ' + getAuthToken().substring(0, 15) + '...)' : 'MISSING',
      tokenLength: getAuthToken()?.length || 0,
      timestamp: new Date().toISOString()
    });
    
    const formattedCode = code.toUpperCase();
    console.log('Formatted code for API:', formattedCode);
    
    const response = await api.post('/cart/apply-coupon', { code: formattedCode });
    console.log('%c✅ COUPON DEBUG - Success response:', 'background: #4CAF50; color: white;', response.data);
    return response.data;
  } catch (error) {
    console.log('%c❌ COUPON DEBUG - Error details:', 'background: #f44336; color: white; font-size: 12px; padding: 4px;', {
      errorMessage: error.message,
      errorResponse: error.response?.data,
      errorStatus: error.response?.status,
      errorHeaders: error.response?.headers,
      requestData: error.config?.data,
      requestUrl: error.config?.url,
      requestMethod: error.config?.method,
      token: error.config?.headers?.Authorization ? 'Present' : 'Missing',
      timestamp: new Date().toISOString()
    });
    throw error;
  }
};

/**
 * Remove coupon from cart
 * @returns {Promise} - Updated cart without discount
 */
export const removeCoupon = async () => {
  try {
    const response = await api.delete('/cart/remove-coupon');
    return response.data;
  } catch (error) {
    console.error('Remove coupon error:', error);
    throw error;
  }
};

/**
 * Validate coupon before applying
 * @param {string} code - Coupon code
 * @param {string} cartId - Cart ID
 * @returns {Promise} - Validation result
 */
export const validateCoupon = async (code, cartId) => {
  try {
    const response = await api.post('/coupons/validate', { 
      code: code.toUpperCase(),
      cartId 
    });
    return response.data;
  } catch (error) {
    console.error('Validate coupon error:', error);
    throw error;
  }
};

/**
 * Get cart item count
 * @returns {Promise<number>} - Number of items in cart
 */
export const getCartCount = async () => {
  try {
    const cart = await getCart();
    return cart?.data?.items?.length || 0;
  } catch (error) {
    console.error('Get cart count error:', error);
    return 0;
  }
};

/**
 * Get cart total
 * @returns {Promise<Object>} - Cart totals
 */
export const getCartTotals = async () => {
  try {
    const cart = await getCart();
    const items = cart?.data?.items || [];
    
    const subtotal = items.reduce((sum, item) => {
      return sum + (item.product?.price || 0) * item.quantity;
    }, 0);
    
    const discount = cart?.data?.discountAmount || 0;
    const total = Math.max(0, subtotal - discount);
    
    return {
      subtotal,
      discount,
      total,
      itemCount: items.length
    };
  } catch (error) {
    console.error('Get cart totals error:', error);
    return { subtotal: 0, discount: 0, total: 0, itemCount: 0 };
  }
};

/**
 * Check if cart has items
 * @returns {Promise<boolean>} - True if cart has items
 */
export const hasCartItems = async () => {
  try {
    const cart = await getCart();
    return (cart?.data?.items?.length || 0) > 0;
  } catch (error) {
    return false;
  }
};

/**
 * Get applied coupon details
 * @returns {Promise<Object|null>} - Coupon details or null
 */
export const getAppliedCoupon = async () => {
  try {
    const cart = await getCart();
    if (cart?.data?.couponCode) {
      return {
        code: cart.data.couponCode,
        discount: cart.data.discountAmount || 0
      };
    }
    return null;
  } catch (error) {
    return null;
  }
};

// Export all methods as a single object for convenience
export const cartApi = {
  addToCart,
  getCart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
  applyCoupon,
  removeCoupon,
  validateCoupon,
  getCartCount,
  getCartTotals,
  hasCartItems,
  getAppliedCoupon
};

// Default export for convenience
export default cartApi;