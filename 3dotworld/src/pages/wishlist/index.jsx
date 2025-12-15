import React, { useEffect, useState } from 'react';
import { 
  FaHeart, 
  FaTrash, 
  FaShoppingCart, 
  FaRegHeart,
  FaArrowLeft
} from 'react-icons/fa';
import { useWishlist } from '../../contexts/WishlistContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const WishlistPage = () => {
  const navigate = useNavigate();
  const { 
    wishlist, 
    productDetails,
    removeFromWishlist, 
    clearWishlist, 
    moveToCart,
    loading, 
    error,
    getWishlistCount,
    isLoggedIn,
    fetchWishlist
  } = useWishlist();
  
  const [movingToCart, setMovingToCart] = useState({});
  const [removingIds, setRemovingIds] = useState({});

  // Refresh wishlist on page load
  useEffect(() => {
  
    
    fetchWishlist();
  }, [isLoggedIn, navigate, fetchWishlist]);

  // Remove from wishlist
  const handleRemove = async (productId, productName) => {
    setRemovingIds(prev => ({ ...prev, [productId]: true }));
    const result = await removeFromWishlist(productId);
    setRemovingIds(prev => ({ ...prev, [productId]: false }));

    if (result.success) {
      toast.success(`${productName || 'Product'} removed from wishlist`);
    } else {
      toast.error(result.message || 'Failed to remove from wishlist');
    }
  };

  // Move product to cart
  const handleMoveToCart = async (productId, productName) => {
    setMovingToCart(prev => ({ ...prev, [productId]: true }));
    const result = await moveToCart(productId);
    setMovingToCart(prev => ({ ...prev, [productId]: false }));

    if (result.success) {
      toast.success(`${productName} moved to cart!`, { autoClose: 2000 });
    } else {
      toast.error(result.message || 'Failed to move to cart');
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to clear your entire wishlist?')) return;
    const result = await clearWishlist();
    if (result.success) {
      toast.success('Wishlist cleared successfully!');
    } else {
      toast.error(result.message || 'Failed to clear wishlist');
    }
  };

  const handleContinueShopping = () => navigate('/products');

  // Loading state
  if (loading && wishlist.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchWishlist}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Not logged in state (fallback)
  

  // Empty wishlist state
  if (getWishlistCount() === 0 && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FaArrowLeft />
              <span>Back to Shopping</span>
            </button>
          </div>

          <div className="text-center py-16 bg-white rounded-2xl shadow-sm max-w-2xl mx-auto">
            <div className="relative inline-block mb-6">
              <FaRegHeart className="text-gray-300 text-7xl" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-full animate-ping"></div>
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-800 mb-3">Your Wishlist is Empty</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any favorite items yet. Start exploring our collection!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleContinueShopping}
                className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium shadow-md hover:shadow-lg"
              >
                Start Shopping
              </button>
              
              <Link
                to="/"
                className="bg-white border border-gray-300 text-gray-800 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                View Deals
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render wishlist items
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header with back and clear all */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <FaArrowLeft />
            <span>Continue Shopping</span>
          </button>
          
          {getWishlistCount() > 0 && (
            <button
              onClick={handleClearAll}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
            >
              <FaTrash />
              Clear All
            </button>
          )}
        </div>

        {/* Main Header */}
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center sm:justify-start gap-3">
            <FaHeart className="text-red-500" />
            My Wishlist
          </h1>
          <p className="text-gray-600 mt-2">
            {getWishlistCount()} item{getWishlistCount() !== 1 ? 's' : ''} saved for later
          </p>
        </div>

        {/* Wishlist Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((item) => {
            const productId = item.product?._id || item.product;
            const product = productDetails?.[productId];

            // Placeholder if product details not ready
            if (!product) {
              return (
                <div key={productId} className="bg-white rounded-xl shadow-sm p-4 animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              );
            }

            return (
              <div key={product._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group relative">
                {/* Discount Badge */}
                {product.discountPercentage > 0 && (
                  <div className="absolute top-3 left-3 z-10">
                    <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      -{Math.round(product.discountPercentage)}%
                    </span>
                  </div>
                )}

                {/* Remove Button */}
                <button
                  onClick={() => handleRemove(product._id, product.name)}
                  disabled={removingIds[product._id]}
                  className="absolute top-3 right-3 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-red-50 hover:text-red-500 transition-all duration-300 disabled:opacity-50"
                  title="Remove from wishlist"
                >
                  {removingIds[product._id] ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                  ) : (
                    <FaTrash size={16} />
                  )}
                </button>

                {/* Product Image */}
                <Link to={`/product/${product._id}`} className="block">
                  <div className="h-64 overflow-hidden bg-gray-100 relative">
                    <img
                      src={product.images?.[0] || '/images/placeholder.jpg'}
                      alt={product.name}
                      className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x300?text=Product';
                      }}
                    />

                    {product.stock <= 0 && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-white font-bold text-lg bg-red-600/80 px-4 py-2 rounded-full">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>
                </Link>

                {/* Product Info */}
                <div className="p-4">
                  <Link to={`/product/${product._id}`}>
                    <h3 className="font-semibold text-gray-900 hover:text-red-600 line-clamp-2 mb-2 text-sm sm:text-base transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  
                  {product.category && (
                    <span className="inline-block text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded mb-3">
                      {product.category}
                    </span>
                  )}

                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
                    {product.originalPrice > product.price && (
                      <>
                        <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
                        <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded">
                          Save ₹{product.originalPrice - product.price}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRemove(product._id, product.name)}
                      disabled={removingIds[product._id]}
                      className="flex-1 py-2 px-3 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      {removingIds[product._id] ? 'Removing...' : 'Remove'}
                    </button>
                    
                    <button
                      onClick={() => handleMoveToCart(product._id, product.name)}
                      disabled={product.stock <= 0 || movingToCart[product._id]}
                      className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed
                        ${product.stock <= 0 ? 'bg-gray-100 text-gray-400' : 'bg-red-600 text-white hover:bg-red-700'}`}
                    >
                      {movingToCart[product._id] ? 'Moving...' : (product.stock <= 0 ? 'Out of Stock' : 'Move to Cart')}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
