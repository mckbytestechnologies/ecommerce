import React, { useEffect, useState } from 'react';
import { 
  FaHeart, 
  FaTrash, 
  FaShoppingCart, 
  FaRegHeart,
  FaArrowLeft,
  FaShoppingBag
} from 'react-icons/fa';
import { useWishlist } from '../../contexts/WishlistContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

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

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const handleRemove = async (productId, productName) => {
    setRemovingIds(prev => ({ ...prev, [productId]: true }));
    const result = await removeFromWishlist(productId);
    if (result.success) {
      toast.success(`${productName || 'Product'} removed`);
    }
    setRemovingIds(prev => ({ ...prev, [productId]: false }));
  };

  const handleMoveToCart = async (productId, productName) => {
    setMovingToCart(prev => ({ ...prev, [productId]: true }));
    const result = await moveToCart(productId);
    if (result.success) {
      toast.success(`${productName} moved to cart!`);
    } else {
      toast.error(result.message || 'Failed to move to cart');
    }
    setMovingToCart(prev => ({ ...prev, [productId]: false }));
  };

  // UI Components
  if (loading && wishlist.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-red-100 border-t-red-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500 font-medium">Fetching your favorites...</p>
        </div>
      </div>
    );
  }

  if (getWishlistCount() === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center bg-white p-10 rounded-3xl shadow-xl shadow-red-100/50">
          <div className="bg-red-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaRegHeart className="text-red-500 text-4xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-8">Save items you love here to keep an eye on them.</p>
          <button 
            onClick={() => navigate('/products')}
            className="w-full bg-red-600 text-white py-4 rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200"
          >
            Explore Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfcfc] pb-20">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <button 
                onClick={() => navigate(-1)}
                className="flex items-center text-sm font-semibold text-gray-500 hover:text-red-600 transition-colors mb-2"
              >
                <FaArrowLeft className="mr-2" /> Back
              </button>
              <h1 className="text-3xl font-black text-gray-900 flex items-center">
                My <span className="text-red-600 ml-2">Wishlist</span>
                <span className="ml-3 px-3 py-1 bg-red-100 text-red-600 text-sm rounded-full">
                  {getWishlistCount()}
                </span>
              </h1>
            </div>
            
            {getWishlistCount() > 0 && (
              <button
                onClick={clearWishlist}
                className="text-gray-400 hover:text-red-600 text-sm font-medium flex items-center gap-2 transition-colors"
              >
                <FaTrash size={12} /> Clear all items
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {wishlist.map((item) => {
            // FIX: Prioritize item.product if it's already an object (populated)
            // fallback to productDetails if item.product is just an ID
            const product = (typeof item.product === 'object') ? item.product : productDetails?.[item.product];

            if (!product) return null; // Skip if still not found to prevent empty card shell

            return (
              <div key={product._id} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-red-100 transition-all duration-300">
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                  <img
                    src={product.images?.[0] || 'https://via.placeholder.com/400'}
                    alt={product.name}
                    className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Floating Action: Remove */}
                  <button
                    onClick={() => handleRemove(product._id, product.name)}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-white transition-all shadow-sm"
                  >
                    {removingIds[product._id] ? <div className="w-4 h-4 border-2 border-red-600 border-t-transparent animate-spin rounded-full" /> : <FaTrash size={14} />}
                  </button>

                  {product.discountPercentage > 0 && (
                    <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                      {Math.round(product.discountPercentage)}% Off
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">{product.category}</p>
                  <Link to={`/product/${product._id}`}>
                    <h3 className="font-bold text-gray-800 line-clamp-1 group-hover:text-red-600 transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-xl font-black text-gray-900">₹{product.price}</span>
                    {product.originalPrice > product.price && (
                      <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
                    )}
                  </div>

                  {/* Move to Cart Button */}
                  <button
                    onClick={() => handleMoveToCart(product._id, product.name)}
                    disabled={product.stock <= 0 || movingToCart[product._id]}
                    className={`mt-5 w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all 
                      ${product.stock <= 0 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-red-600 text-white hover:bg-black shadow-md hover:shadow-xl shadow-red-100 hover:shadow-black/20'
                      }`}
                  >
                    {movingToCart[product._id] ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full" />
                    ) : (
                      <>
                        <FaShoppingCart size={16} />
                        {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                      </>
                    )}
                  </button>
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