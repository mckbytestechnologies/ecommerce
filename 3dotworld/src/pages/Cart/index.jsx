
import React, { useEffect, useState } from "react";
import { FaTrash, FaPlus, FaMinus, FaTag, FaShoppingCart, FaTimesCircle, FaAngleRight } from "react-icons/fa";
import { cartApi } from "../../utils/cartApi";
import "./CartPage.css"; // Assuming this handles global styles, but Tailwind is primary

// --- Configuration ---
const BRAND_RED = 'bg-red-700';
const HOVER_RED = 'hover:bg-red-800';
const TEXT_RED = 'text-red-700';
const BORDER_RED = 'border-red-700';

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [updatingItems, setUpdatingItems] = useState({});

  // --- API Handlers ---

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartApi.getCart();
      setCart(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching cart:", err);
      setError(err.response?.data?.message || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
    const handleCartUpdate = () => {
      fetchCart();
    };
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setUpdatingItems(prev => ({ ...prev, [itemId]: true }));

    try {
      const response = await cartApi.updateItem(itemId, newQuantity);
      setCart(response.data);
    } catch (err) {
      console.error("Error updating quantity:", err);
      alert(err.response?.data?.message || "Failed to update quantity");
    } finally {
      setUpdatingItems(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const removeItem = async (itemId) => {
    if (!window.confirm("Remove this item from cart?")) return;

    try {
      const response = await cartApi.removeItem(itemId);
      setCart(response.data);
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      console.error("Error removing item:", err);
      alert(err.response?.data?.message || "Failed to remove item");
    }
  };

  const applyCoupon = async (code = couponCode) => {
    const isRemoving = code === 'REMOVE';
    const codeToApply = isRemoving ? '' : code.trim();

    if (!codeToApply && !isRemoving) {
      alert("Please enter a coupon code");
      return;
    }

    setApplyingCoupon(true);
    try {
      const response = await cartApi.applyCoupon(codeToApply);
      setCart(response.data);
      setCouponCode("");
    } catch (err) {
      console.error("Error applying coupon:", err);
      alert(err.response?.data?.message || (isRemoving ? "Failed to remove coupon" : "Invalid coupon code"));
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm("Clear all items from cart?")) return;

    try {
      const response = await cartApi.clearCart();
      setCart(response.data);
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      console.error("Error clearing cart:", err);
      alert(err.response?.data?.message || "Failed to clear cart");
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

  // --- Render Logic (Loading, Error, Empty) ---

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className={`animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 ${BORDER_RED} mx-auto`}></div>
          <p className="mt-6 text-xl text-gray-800 font-medium">Loading your luxury collection...</p>
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
          <a 
            href="/products"
            className={`inline-block px-10 py-4 ${BRAND_RED} text-white text-lg font-bold rounded-full ${HOVER_RED} transition duration-500 shadow-xl shadow-red-300/50 transform hover:scale-[1.05]`}
          >
            Shop The Collection
            <FaAngleRight className="inline ml-2" />
          </a>
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
                    <a href={`/products/${item.product?._id}`} className="w-32 h-32 flex-shrink-0 border border-gray-100 rounded-lg overflow-hidden shadow-lg">
                      <img
                        src={item.product?.images?.[0] || '/placeholder.jpg'}
                        alt={item.product?.name}
                        className="w-full h-full object-cover transform hover:scale-105 transition duration-500"
                      />
                    </a>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <a href={`/products/${item.product?._id}`} className="font-bold text-2xl text-gray-900 hover:text-red-700 transition truncate block">
                        {item.product?.name}
                      </a>
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
                <a href="/products" className="text-gray-700 font-medium hover:text-gray-900 flex items-center transition">
                    <FaAngleRight className="inline rotate-180 mr-1" /> Continue Shopping
                </a>
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
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Apply Code"
                    className="flex-1 border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-red-500 transition font-medium"
                    disabled={applyingCoupon || cart.couponCode}
                  />
                  <button
                    onClick={() => applyCoupon()}
                    disabled={applyingCoupon || !couponCode.trim() || cart.couponCode}
                    className={`px-5 py-3 ${BRAND_RED} text-white font-bold rounded-lg ${HOVER_RED} transition duration-300 disabled:opacity-50`}
                  >
                    {applyingCoupon ? '...' : 'Apply'}
                  </button>
                </div>
                {cart.couponCode && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex justify-between items-center">
                    <span className="text-red-700 text-sm font-medium">
                      Code **{cart.couponCode}** Active.
                    </span>
                    <button
                      onClick={() => applyCoupon('REMOVE')}
                      className="text-gray-700 hover:text-red-700 text-sm font-semibold ml-2"
                    >
                      (x)
                    </button>
                  </div>
                )}
              </div>

              {/* Summary Details */}
              <div className="space-y-5">
                <div className="flex justify-between text-xl">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">{formatCurrency(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-xl">
                    <span className={`${TEXT_RED} font-medium`}>Exclusive Discount</span>
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
                onClick={() => window.location.href = '/checkout'}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
