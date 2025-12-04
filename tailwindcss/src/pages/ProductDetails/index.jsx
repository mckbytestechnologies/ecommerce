import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  MdDelete, 
  MdAdd, 
  MdRemove, 
  MdShoppingBag,
  MdArrowBack,
  MdLocalOffer,
  MdSecurity,
  MdLogin
} from "react-icons/md";
import { FaHeart, FaRegHeart, FaTruck, FaShieldAlt, FaExclamationTriangle } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

// Create axios instance with interceptors
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 10000,
});

// Add request interceptor to include token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          const response = await axios.post(
            "http://localhost:5000/api/auth/refresh-token",
            { refreshToken }
          );
          
          if (response.data.success) {
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("refreshToken", response.data.refreshToken);
            
            // Retry the original request with new token
            originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // Redirect to login if refresh fails
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        window.location.href = "/auth";
      }
    }
    
    return Promise.reject(error);
  }
);

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [cartSummary, setCartSummary] = useState({
    subtotal: 0,
    shipping: 0,
    tax: 0,
    discount: 0,
    total: 0
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Check authentication on mount
  useEffect(() => {
    checkAuthentication();
  }, []);

  // Fetch cart items when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCartItems();
    }
  }, [isAuthenticated]);

  // Calculate cart summary when items change
  useEffect(() => {
    calculateCartSummary();
  }, [cartItems, appliedCoupon]);

  const checkAuthentication = () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    
    if (token && user) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await api.get("/cart");
      
      if (response.data.success) {
        setCartItems(response.data.cart?.items || []);
      } else {
        toast.error(response.data.message || "Failed to load cart");
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      
      if (error.response?.status === 401) {
        // Handle unauthorized - token expired or invalid
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        setIsAuthenticated(false);
        toast.info("Please login to view your cart");
      } else {
        toast.error("Failed to load cart items. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateCartSummary = () => {
    const subtotal = cartItems.reduce((sum, item) => {
      return sum + (item.product?.price || 0) * item.quantity;
    }, 0);

    // Calculate shipping (free over ₹2000)
    const shipping = subtotal > 2000 || subtotal === 0 ? 0 : 99;

    // Calculate tax (10%)
    const tax = subtotal * 0.1;

    // Calculate discount from coupon
    let discount = 0;
    if (appliedCoupon) {
      if (appliedCoupon.discountType === "percentage") {
        discount = subtotal * (appliedCoupon.discountValue / 100);
      } else {
        discount = appliedCoupon.discountValue;
      }
      // Ensure discount doesn't exceed subtotal
      discount = Math.min(discount, subtotal);
    }

    const total = subtotal + shipping + tax - discount;

    setCartSummary({
      subtotal,
      shipping,
      tax,
      discount,
      total
    });
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      setUpdating(true);
      await api.put(`/cart/update/${itemId}`, { quantity: newQuantity });
      
      // Update local state
      setCartItems(prev => 
        prev.map(item => 
          item._id === itemId 
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
      
      toast.success("Quantity updated");
    } catch (error) {
      console.error("Error updating quantity:", error);
      
      if (error.response?.status === 401) {
        handleAuthError();
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to update quantity");
      }
    } finally {
      setUpdating(false);
    }
  };

  const removeItem = async (itemId) => {
    if (!confirm("Are you sure you want to remove this item from cart?")) {
      return;
    }

    try {
      setUpdating(true);
      await api.delete(`/cart/remove/${itemId}`);
      
      // Remove from local state
      setCartItems(prev => prev.filter(item => item._id !== itemId));
      
      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Error removing item:", error);
      
      if (error.response?.status === 401) {
        handleAuthError();
      } else {
        toast.error("Failed to remove item");
      }
    } finally {
      setUpdating(false);
    }
  };

  const moveToWishlist = async (productId) => {
    try {
      await api.post("/wishlist/add", { productId });
      
      // Remove from cart after moving to wishlist
      const itemToRemove = cartItems.find(item => item.product._id === productId);
      if (itemToRemove) {
        await removeItem(itemToRemove._id);
      }
      
      toast.success("Moved to wishlist");
    } catch (error) {
      console.error("Error moving to wishlist:", error);
      
      if (error.response?.status === 401) {
        handleAuthError();
      } else {
        toast.error("Failed to move to wishlist");
      }
    }
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.warning("Please enter a coupon code");
      return;
    }

    try {
      const response = await api.post("/coupons/validate", { code: couponCode });

      if (response.data.success) {
        setAppliedCoupon(response.data.coupon);
        toast.success("Coupon applied successfully!");
      } else {
        toast.error("Invalid or expired coupon");
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      
      if (error.response?.status === 401) {
        handleAuthError();
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to apply coupon");
      }
    }
  };

  const handleAuthError = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    toast.error("Your session has expired. Please login again.");
  };

  const handleLoginRedirect = () => {
    navigate("/auth", { state: { from: "/cart" } });
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.warning("Your cart is empty");
      return;
    }
    
    if (!isAuthenticated) {
      toast.info("Please login to proceed to checkout");
      navigate("/auth", { state: { from: "/checkout" } });
      return;
    }
    
    navigate("/checkout");
  };

  const handleContinueShopping = () => {
    navigate("/");
  };

  // Guest cart - if not authenticated
  if (!isAuthenticated && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
          >
            <div className="w-40 h-40 mx-auto mb-8 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
              <FaExclamationTriangle className="w-20 h-20 text-yellow-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Authentication Required
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Please login to view your cart and manage your items. If you don't have an account, you can register for free.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleLoginRedirect}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                <MdLogin className="text-xl" />
                Login to Continue
              </button>
              <button
                onClick={handleContinueShopping}
                className="px-8 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
              >
                Continue Shopping
              </button>
            </div>
            <div className="mt-8 p-6 bg-white rounded-2xl shadow-sm max-w-md mx-auto">
              <h3 className="font-semibold text-gray-900 mb-3">Why login?</h3>
              <ul className="text-sm text-gray-600 space-y-2 text-left">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Save items for later purchase
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Access order history and tracking
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Faster checkout experience
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Personalized recommendations
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex gap-4">
                      <div className="w-32 h-32 bg-gray-200 rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm h-64">
                <div className="space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-10 bg-gray-200 rounded w-full mt-4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty cart state (authenticated but empty)
  if (cartItems.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
          >
            <div className="w-40 h-40 mx-auto mb-8 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
              <MdShoppingBag className="w-20 h-20 text-gray-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. Start shopping to discover amazing products!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleContinueShopping}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <MdArrowBack className="inline mr-2" />
                Continue Shopping
              </button>
              <Link
                to="/productlisting"
                className="px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300"
              >
                Browse Products
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Shopping Cart 🛒
              </h1>
              <p className="text-gray-600">
                {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart
              </p>
            </div>
            <button
              onClick={handleContinueShopping}
              className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-medium"
            >
              <MdArrowBack />
              Continue Shopping
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <AnimatePresence>
              {cartItems.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 mb-6 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Product Image */}
                      <Link
                        to={`/productdetails/${item.product._id}`}
                        className="relative group flex-shrink-0"
                      >
                        <div className="w-40 h-40 bg-gray-100 rounded-xl overflow-hidden">
                          <img
                            src={item.product.images?.[0]?.url || "https://via.placeholder.com/200"}
                            alt={item.product.name}
                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/200";
                            }}
                          />
                        </div>
                        {item.product.isFeatured && (
                          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                            Featured
                          </span>
                        )}
                      </Link>

                      {/* Product Details */}
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div>
                            <Link
                              to={`/productdetails/${item.product._id}`}
                              className="text-xl font-semibold text-gray-900 hover:text-red-600 transition-colors"
                            >
                              {item.product.name}
                            </Link>
                            <p className="text-gray-600 text-sm mt-1">
                              {item.product.brand || "Generic Brand"}
                            </p>
                            
                            {/* Price and Quantity Row */}
                            <div className="flex flex-wrap items-center gap-4 mt-4">
                              {/* Price */}
                              <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-gray-900">
                                  ₹{item.product.price.toLocaleString()}
                                </span>
                                {item.product.comparePrice && (
                                  <span className="text-lg text-gray-400 line-through">
                                    ₹{item.product.comparePrice.toLocaleString()}
                                  </span>
                                )}
                                {item.product.comparePrice && (
                                  <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                                    Save ₹{(item.product.comparePrice - item.product.price).toLocaleString()}
                                  </span>
                                )}
                              </div>

                              {/* Quantity Controls */}
                              <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-1">
                                <button
                                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                  disabled={updating || item.quantity <= 1}
                                  className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                  <MdRemove />
                                </button>
                                <input
                                  type="number"
                                  value={item.quantity}
                                  onChange={(e) => {
                                    const value = parseInt(e.target.value);
                                    if (!isNaN(value) && value >= 1) {
                                      updateQuantity(item._id, value);
                                    }
                                  }}
                                  className="w-16 text-center bg-transparent border-none outline-none text-lg font-medium"
                                  min="1"
                                />
                                <button
                                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                  disabled={updating}
                                  className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white disabled:opacity-50 transition-colors"
                                >
                                  <MdAdd />
                                </button>
                              </div>
                            </div>

                            {/* Stock Status */}
                            <div className="mt-4">
                              <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                                item.product.stock > 10 
                                  ? "bg-green-100 text-green-800"
                                  : item.product.stock > 0
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}>
                                {item.product.stock > 10 
                                  ? "In Stock" 
                                  : item.product.stock > 0
                                  ? `Only ${item.product.stock} left`
                                  : "Out of Stock"}
                              </span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-3">
                            <button
                              onClick={() => moveToWishlist(item.product._id)}
                              className="flex items-center gap-2 px-4 py-2 text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
                              title="Move to Wishlist"
                            >
                              <FaRegHeart size={18} />
                              <span className="hidden sm:inline">Wishlist</span>
                            </button>
                            <button
                              onClick={() => removeItem(item._id)}
                              disabled={updating}
                              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Remove Item"
                            >
                              <MdDelete size={20} />
                              <span className="hidden sm:inline">Remove</span>
                            </button>
                          </div>
                        </div>

                        {/* Subtotal */}
                        <div className="mt-6 pt-6 border-t border-gray-100">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Item Subtotal:</span>
                            <span className="text-xl font-bold text-gray-900">
                              ₹{(item.product.price * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
            >
              <div className="bg-white p-4 rounded-xl text-center border border-gray-200">
                <FaTruck className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-sm font-medium">Free Shipping</p>
                <p className="text-xs text-gray-500">Over ₹2,000</p>
              </div>
              <div className="bg-white p-4 rounded-xl text-center border border-gray-200">
                <FaShieldAlt className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm font-medium">Secure Payment</p>
                <p className="text-xs text-gray-500">100% safe & secure</p>
              </div>
              <div className="bg-white p-4 rounded-xl text-center border border-gray-200">
                <MdSecurity className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <p className="text-sm font-medium">Easy Returns</p>
                <p className="text-xs text-gray-500">30 day returns</p>
              </div>
              <div className="bg-white p-4 rounded-xl text-center border border-gray-200">
                <MdLocalOffer className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                <p className="text-sm font-medium">Best Price</p>
                <p className="text-xs text-gray-500">Price match guarantee</p>
              </div>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="sticky top-6"
            >
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Order Summary
                </h2>

                {/* Order Details */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">₹{cartSummary.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {cartSummary.shipping === 0 ? "FREE" : `₹${cartSummary.shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (10%)</span>
                    <span className="font-medium">₹{cartSummary.tax.toFixed(2)}</span>
                  </div>
                  
                  {/* Coupon Section */}
                  {appliedCoupon && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="flex justify-between text-green-600 bg-green-50 p-3 rounded-lg"
                    >
                      <div>
                        <span className="font-medium">Discount ({appliedCoupon.code})</span>
                        <p className="text-xs text-green-500">
                          {appliedCoupon.discountType === "percentage" 
                            ? `${appliedCoupon.discountValue}% off`
                            : `₹${appliedCoupon.discountValue} off`
                          }
                        </p>
                      </div>
                      <span className="font-bold">-₹{cartSummary.discount.toFixed(2)}</span>
                    </motion.div>
                  )}
                </div>

                {/* Coupon Input */}
                <div className="mb-6">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={!!appliedCoupon}
                    />
                    <button
                      onClick={applyCoupon}
                      disabled={!!appliedCoupon || !couponCode.trim()}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {appliedCoupon ? "Applied" : "Apply"}
                    </button>
                  </div>
                  {appliedCoupon && (
                    <button
                      onClick={() => {
                        setAppliedCoupon(null);
                        setCouponCode("");
                      }}
                      className="text-sm text-red-500 hover:text-red-700 mt-2"
                    >
                      Remove coupon
                    </button>
                  )}
                </div>

                {/* Total */}
                <div className="border-t border-gray-200 pt-6 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xl font-bold text-gray-900">Total</span>
                    <div>
                      <div className="text-3xl font-bold text-gray-900">
                        ₹{cartSummary.total.toLocaleString()}
                      </div>
                      <p className="text-sm text-gray-500 text-right">
                        (Inclusive of all taxes)
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 text-center mb-6">
                    You'll save ₹{cartSummary.discount.toFixed(2)} with this order
                  </p>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={updating || cartItems.length === 0}
                  className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold text-lg hover:shadow-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {updating ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </div>
                  ) : (
                    <>
                      Proceed to Checkout
                      <span className="ml-2">→</span>
                    </>
                  )}
                </button>

                {/* Payment Methods */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-3 text-center">
                    We accept
                  </p>
                  <div className="flex justify-center gap-4">
                    <img src="https://cdn-icons-png.flaticon.com/512/196/196578.png" alt="Visa" className="h-8" />
                    <img src="https://cdn-icons-png.flaticon.com/512/196/196561.png" alt="Mastercard" className="h-8" />
                    <img src="https://cdn-icons-png.flaticon.com/512/196/196565.png" alt="PayPal" className="h-8" />
                    <img src="https://cdn-icons-png.flaticon.com/512/888/888870.png" alt="Apple Pay" className="h-8" />
                    <img src="https://cdn-icons-png.flaticon.com/512/888/888879.png" alt="Google Pay" className="h-8" />
                  </div>
                </div>

                {/* Security Info */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <FaShieldAlt className="text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Secure Checkout
                      </p>
                      <p className="text-xs text-gray-500">
                        Your payment information is encrypted and secure. We don't store your credit card details.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recently Viewed Suggestions */}
              <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Frequently bought together
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Wireless Earbuds</p>
                      <p className="text-sm text-green-600 font-bold">₹2,999</p>
                    </div>
                    <button className="text-blue-600 hover:text-red-800">
                      Add
                    </button>
                  </div>
                  <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Phone Case</p>
                      <p className="text-sm text-green-600 font-bold">₹499</p>
                    </div>
                    <button className="text-blue-600 hover:text-red-800">
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Need Help Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Need help with your order?
              </h3>
              <p className="text-gray-600">
                Our customer support team is here to help you 24/7
              </p>
            </div>
            <div className="flex gap-4">
              <button className="px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded-xl font-medium hover:bg-blue-50 transition-colors">
                Chat with us
              </button>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors">
                Call Support
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Cart;