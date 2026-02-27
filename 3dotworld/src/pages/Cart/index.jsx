import React, { useEffect, useState } from "react";
import { FaTrash, FaPlus, FaMinus, FaTag, FaShoppingCart, FaTimesCircle, FaAngleRight } from "react-icons/fa";
import { cartApi } from "../../utils/cartApi";
import "./CartPage.css";
import { useNavigate } from "react-router-dom";

// --- Configuration ---
const BRAND_RED = 'bg-red-700';
const HOVER_RED = 'hover:bg-red-800';
const TEXT_RED = 'text-red-700';
const BORDER_RED = 'border-red-700';

const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [updatingItems, setUpdatingItems] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Get token from multiple possible locations
  const getToken = () => {
    return localStorage.getItem('authToken') || 
           sessionStorage.getItem('authToken') ||
           localStorage.getItem('token') || 
           localStorage.getItem('adminAuthToken');
  };

  // Check if token is expired
  const isTokenExpired = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64));
      const now = Date.now() / 1000;
      return payload.exp < now;
    } catch (e) {
      return true; // If can't decode, treat as expired
    }
  };

  // Clear all auth data
  const clearAuthData = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('adminAuthToken');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      const token = getToken();
      
      if (!token) {
        setIsAuthenticated(false);
        setAuthChecked(true);
        return;
      }

      if (isTokenExpired(token)) {
        clearAuthData();
        setError("Session expired. Please login again.");
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
      }
      
      setAuthChecked(true);
    };

    checkAuth();
  }, []);

  // --- API Handlers ---

  const fetchCart = async () => {
    try {
      setLoading(true);
      
      const token = getToken();
      if (!token || isTokenExpired(token)) {
        if (!token) {
          setError("Please login to view your cart");
        } else {
          clearAuthData();
          setError("Session expired. Please login again.");
        }
        setLoading(false);
        return;
      }

      const response = await cartApi.getCart();
      
      // Handle different response structures
      const cartData = response.data?.data || response.data || { items: [] };
      setCart(cartData);
      setError("");
      setCouponError("");
    } catch (err) {
      console.error("Error fetching cart:", err);
      
      if (err.response?.status === 401) {
        clearAuthData();
        setError("Session expired. Please login again.");
      } else {
        setError(err.response?.data?.message || "Failed to load cart");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authChecked && isAuthenticated) {
      fetchCart();
    }
    
    const handleCartUpdate = () => {
      if (isAuthenticated) {
        fetchCart();
      }
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [authChecked, isAuthenticated]);

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const token = getToken();
    if (!token || isTokenExpired(token)) {
      setError("Session expired. Please login again.");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }
    
    setUpdatingItems(prev => ({ ...prev, [itemId]: true }));

    try {
      const response = await cartApi.updateCartQuantity(itemId, newQuantity);
      const cartData = response.data?.data || response.data;
      setCart(cartData);
      setCouponError("");
    } catch (err) {
      console.error("Error updating quantity:", err);
      
      if (err.response?.status === 401) {
        clearAuthData();
        setError("Session expired. Please login again.");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        alert(err.response?.data?.message || "Failed to update quantity");
      }
    } finally {
      setUpdatingItems(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const removeItem = async (itemId) => {
    if (!window.confirm("Remove this item from cart?")) return;

    const token = getToken();
    if (!token || isTokenExpired(token)) {
      setError("Session expired. Please login again.");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    try {
      const response = await cartApi.removeFromCart(itemId);
      const cartData = response.data?.data || response.data;
      setCart(cartData);
      window.dispatchEvent(new Event('cartUpdated'));
      setCouponError("");
    } catch (err) {
      console.error("Error removing item:", err);
      
      if (err.response?.status === 401) {
        clearAuthData();
        setError("Session expired. Please login again.");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        alert(err.response?.data?.message || "Failed to remove item");
      }
    }
  };

  const applyCoupon = async (code = couponCode) => {
    const isRemoving = code === 'REMOVE';
    const codeToApply = isRemoving ? '' : code.trim().toUpperCase();

    // Check if user is authenticated
    const token = getToken();
    if (!token || isTokenExpired(token)) {
      setCouponError("Please login to apply coupons");
      setTimeout(() => {
        navigate('/login?redirect=/cart');
      }, 2000);
      return;
    }

    if (!codeToApply && !isRemoving) {
      setCouponError("Please enter a coupon code");
      return;
    }

    setApplyingCoupon(true);
    setCouponError("");
    setCouponSuccess("");

    try {
      let response;
      
      if (isRemoving) {
        // Remove coupon
        response = await cartApi.removeCoupon();
      } else {
        // Apply coupon
        response = await cartApi.applyCoupon(codeToApply);
      }
      
      const cartData = response.data?.data || response.data;
      setCart(cartData);
      setCouponCode("");
      
      if (isRemoving) {
        setCouponSuccess("Coupon removed successfully!");
      } else {
        setCouponSuccess("Coupon applied successfully!");
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => setCouponSuccess(""), 3000);
      
    } catch (err) {
      console.error("Error applying coupon:", err);
      
      // Handle specific error messages
      let errorMessage = err.response?.data?.message || 
                        err.response?.data?.errors?.[0]?.msg ||
                        "Invalid coupon code";
      
      // Handle authentication errors
      if (err.response?.status === 401) {
        clearAuthData();
        errorMessage = "Session expired. Please login again.";
        setTimeout(() => {
          navigate('/login?redirect=/cart');
        }, 2000);
      }
      
      setCouponError(errorMessage);
      
      // Clear error message after 5 seconds
      setTimeout(() => setCouponError(""), 5000);
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm("Clear all items from cart?")) return;

    const token = getToken();
    if (!token || isTokenExpired(token)) {
      setError("Session expired. Please login again.");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    try {
      const response = await cartApi.clearCart();
      const cartData = response.data?.data || response.data;
      setCart(cartData);
      window.dispatchEvent(new Event('cartUpdated'));
      setCouponError("");
      setCouponSuccess("");
    } catch (err) {
      console.error("Error clearing cart:", err);
      
      if (err.response?.status === 401) {
        clearAuthData();
        setError("Session expired. Please login again.");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        alert(err.response?.data?.message || "Failed to clear cart");
      }
    }
  };

  // Calculate totals
  const calculateTotals = () => {
    if (!cart || !cart.items || cart.items.length === 0) {
      return { subtotal: 0, discount: 0, total: 0 };
    }

    const subtotal = cart.items.reduce((sum, item) => {
      const price = item.product?.price || 0;
      return sum + (price * item.quantity);
    }, 0);

    const discount = cart.discountAmount || 0;
    const total = Math.max(0, subtotal - discount);

    return { subtotal, discount, total };
  };

  const { subtotal, discount, total } = calculateTotals();
  const formatCurrency = (amount) => `₹${amount.toFixed(2)}`;

  // --- Render Logic ---
  if (loading && authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className={`animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 ${BORDER_RED} mx-auto`}></div>
          <p className="mt-6 text-xl text-gray-800 font-medium">Loading your luxury collection...</p>
        </div>
      </div>
    );
  }

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className={`animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 ${BORDER_RED} mx-auto`}></div>
          <p className="mt-6 text-xl text-gray-800 font-medium">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (error && (error.includes("login") || error.includes("Session expired"))) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-10 bg-white rounded-xl shadow-2xl border-t-4 border-red-700">
          <p className="text-red-700 font-bold text-2xl mb-4">Authentication Required</p>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => navigate('/login?redirect=/cart')}
            className={`inline-block px-8 py-3 ${BRAND_RED} text-white font-semibold rounded-lg ${HOVER_RED} transition duration-300 transform hover:scale-[1.02]`}
          >
            Login to Continue
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-10 bg-white rounded-xl shadow-2xl border-t-4 border-red-700">
          <p className="text-red-700 font-bold text-2xl mb-4">Error</p>
          <p className="text-gray-700 mb-6">{error}</p>
          <button 
            onClick={fetchCart}
            className={`mt-4 px-8 py-3 ${BRAND_RED} text-white font-semibold rounded-lg ${HOVER_RED} transition duration-300 transform hover:scale-[1.02]`}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-lg p-12 bg-white rounded-xl">
          <div className={`${TEXT_RED} mb-6`}>
            <FaShoppingCart size={80} className="mx-auto" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Your Cart Is Empty</h1>
          <p className="text-gray-600 mb-10 text-lg">It's time to find your next essential. Browse our premium selection.</p>
          <button
            onClick={() => navigate("/productlisting")}
            className={`inline-block px-10 py-4 ${BRAND_RED} text-white text-lg font-bold rounded-full ${HOVER_RED} transition duration-500 shadow-xl shadow-red-300/50 transform hover:scale-[1.05]`}
          >
            Shop The Collection
            <FaAngleRight className="inline ml-2" />
          </button>
        </div>
      </div>
    );
  }

  // --- Main Cart Render ---
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-2 tracking-tight">
            Your Premium Cart
          </h1>
          <p className="text-gray-600 text-xl font-light">
            Review and finalize your selection of {cart.items.length} exquisite {cart.items.length === 1 ? 'item' : 'items'}
          </p>
          {!isAuthenticated && (
            <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 rounded-lg inline-block">
              <p className="text-yellow-700">
                Please <button onClick={() => navigate('/login?redirect=/cart')} className="font-bold underline">login</button> to apply coupons
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Cart Items Section */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-3xl shadow-2xl divide-y divide-gray-100 p-4">
              
              {/* Cart Items List */}
              {cart.items.map((item) => {
                const itemTotal = (item.product?.price || 0) * item.quantity;
                const isUpdating = updatingItems[item._id];

                return (
                  <div key={item._id} className="p-4 sm:p-6 flex flex-col md:flex-row items-start md:items-center gap-6 transition duration-300 hover:bg-red-50/50 rounded-xl">
                    
                    {/* Product Image */}
                    <button 
                      onClick={() => navigate(`/productdetails/${item.product?._id}`)}
                      className="w-32 h-32 flex-shrink-0 border border-gray-100 rounded-lg overflow-hidden shadow-lg"
                    >
                      <img
                        src={(() => {
                          if (!item.product) return '/placeholder.jpg';
                          if (item.product.images?.[0]?.url) return item.product.images[0].url;
                          if (item.product.images?.[0]) return item.product.images[0];
                          if (item.product.image) return item.product.image;
                          return '/placeholder.jpg';
                        })()}
                        alt={item.product?.name || 'Product'}
                        className="w-full h-full object-cover transform hover:scale-105 transition duration-500"
                        onError={(e) => {
                          e.target.src = '/placeholder.jpg';
                        }}
                      />
                    </button>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <button 
                        onClick={() => navigate(`/productdetails/${item.product?._id}`)}
                        className="font-bold text-2xl text-gray-900 hover:text-red-700 transition truncate block text-left"
                      >
                        {item.product?.name}
                      </button>
                      <p className="text-sm mt-1 text-gray-500">
                        {item.product?.stock > 0 ? `Stock: ${item.product?.stock} units` : 'Out of Stock'}
                      </p>
                      <p className="text-3xl font-extrabold text-red-700 mt-3">{formatCurrency(item.product?.price || 0)}</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-0 border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        disabled={isUpdating || item.quantity <= 1}
                        className={`w-10 h-10 flex items-center justify-center ${BRAND_RED} text-white ${HOVER_RED} transition duration-300 disabled:opacity-30`}
                      >
                        <FaMinus size={14} />
                      </button>
                      
                      <span className="w-12 h-10 flex items-center justify-center text-center font-bold text-lg bg-white text-gray-800">
                        {isUpdating ? (
                          <span className={`inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 ${BORDER_RED}`}></span>
                        ) : (
                          item.quantity
                        )}
                      </span>
                      
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        disabled={isUpdating || item.quantity >= (item.product?.stock || 0)}
                        className={`w-10 h-10 flex items-center justify-center ${BRAND_RED} text-white ${HOVER_RED} transition duration-300 disabled:opacity-30`}
                      >
                        <FaPlus size={14} />
                      </button>
                    </div>

                    {/* Total and Remove */}
                    <div className="flex flex-col items-end space-y-3 pl-4">
                      <p className="text-2xl font-extrabold text-gray-900">
                        {formatCurrency(itemTotal)}
                      </p>
                      <button
                        onClick={() => removeItem(item._id)}
                        className={`text-gray-500 hover:${TEXT_RED} flex items-center text-sm font-medium transition`}
                      >
                        <FaTimesCircle className="mr-1" size={14} />
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Clear Cart Button */}
              <div className="p-6 sm:p-8 bg-gray-50/50 rounded-b-3xl flex justify-between items-center">
                <button 
                  onClick={() => navigate("/productlisting")}
                  className="text-gray-700 font-medium hover:text-gray-900 flex items-center transition"
                >
                    <FaAngleRight className="inline rotate-180 mr-1" /> Continue Shopping
                </button>
                <button
                  onClick={handleClearCart}
                  className="px-4 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-100 flex items-center transition font-semibold"
                >
                  <FaTrash className="mr-2" />
                  Clear Entire Cart
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-3xl shadow-2xl p-8 sticky top-10 border-t-4 border-red-700">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 pb-3 border-b border-gray-200">Order Summary</h2>

              {/* Coupon Section */}
              <div className="mb-8">
                <div className="flex items-center mb-3">
                  <FaTag className={`mr-2 ${TEXT_RED}`} />
                  <span className="font-semibold text-lg text-gray-800">Promotional Code</span>
                </div>
                
                {/* Authentication Warning */}
                {!isAuthenticated && (
                  <div className="mb-3 p-3 bg-yellow-100 border border-yellow-400 rounded-lg">
                    <p className="text-yellow-700 text-sm">
                      <button onClick={() => navigate('/login?redirect=/cart')} className="font-bold underline">Login</button> to apply coupons
                    </p>
                  </div>
                )}
                
                {/* Error Message Display */}
                {couponError && (
                  <div className="mb-3 p-3 bg-red-100 border border-red-400 rounded-lg">
                    <p className="text-red-700 text-sm font-medium">{couponError}</p>
                  </div>
                )}
                
                {/* Success Message Display */}
                {couponSuccess && (
                  <div className="mb-3 p-3 bg-green-100 border border-green-400 rounded-lg">
                    <p className="text-green-700 text-sm font-medium">{couponSuccess}</p>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter coupon code"
                    className={`flex-1 border-2 rounded-lg px-4 py-3 focus:border-red-500 transition font-medium ${
                      couponError ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={applyingCoupon || cart.couponCode || !isAuthenticated}
                  />
                  <button
                    onClick={() => applyCoupon()}
                    disabled={applyingCoupon || !couponCode.trim() || cart.couponCode || !isAuthenticated}
                    className={`px-5 py-3 ${BRAND_RED} text-white font-bold rounded-lg ${HOVER_RED} transition duration-300 disabled:opacity-50 min-w-[80px]`}
                  >
                    {applyingCoupon ? (
                      <span className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
                    ) : (
                      'Apply'
                    )}
                  </button>
                </div>
                
                {cart.couponCode && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex justify-between items-center">
                    <span className="text-red-700 text-sm font-medium">
                      <FaTag className="inline mr-1" />
                      Code <strong>{cart.couponCode}</strong> applied
                    </span>
                    <button
                      onClick={() => applyCoupon('REMOVE')}
                      className="text-gray-500 hover:text-red-700 text-sm font-semibold ml-2 px-2 py-1 hover:bg-red-100 rounded transition"
                      title="Remove coupon"
                      disabled={!isAuthenticated}
                    >
                      ✕
                    </button>
                  </div>
                )}
                
                {/* Coupon Help Text */}
                <p className="text-xs text-gray-500 mt-2">
                  {isAuthenticated 
                    ? "Enter coupon code to get exclusive discounts"
                    : "Please login to apply coupons"}
                </p>
              </div>

              {/* Summary Details */}
              <div className="space-y-5">
                <div className="flex justify-between text-xl">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">{formatCurrency(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-xl">
                    <span className={`${TEXT_RED} font-medium`}>Discount Applied</span>
                    <span className={`${TEXT_RED} font-bold`}>- {formatCurrency(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-3xl font-extrabold border-t-2 border-gray-300 pt-6 mt-6">
                  <span>Grand Total</span>
                  <span className={`${TEXT_RED}`}>{formatCurrency(total)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                className={`w-full mt-10 py-5 ${BRAND_RED} text-white text-xl font-extrabold rounded-xl ${HOVER_RED} transition duration-500 shadow-xl shadow-red-500/50 transform hover:scale-[1.02]`}
                onClick={() => isAuthenticated ? navigate('/Checkout') : navigate('/login?redirect=/Checkout')}
              >
                {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;