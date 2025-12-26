import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import { FaHeart, FaRegHeart, FaShoppingBag } from "react-icons/fa";
import { MdOutlineZoomOutMap } from "react-icons/md";
import { toast } from "react-hot-toast";
import { addToCart } from "../../utils/cart";

const ProductCard = ({
  productId,
  imageFront,
  imageBack,
  category,
  title,
  rating = 0,
  oldPrice,
  newPrice,
}) => {
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [checkingWishlist, setCheckingWishlist] = useState(true);

  const discount =
    oldPrice && newPrice
      ? Math.round(((oldPrice - newPrice) / oldPrice) * 100)
      : 0;

  // Get auth token
  const getToken = () => {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  };

  /* ================= CHECK WISHLIST ================= */
  const checkWishlistStatus = async () => {
    try {
      const token = getToken();
      if (!token) {
        setCheckingWishlist(false);
        return;
      }

      const response = await axios.get(
        `https://ecommerce-server-fhna.onrender.com/api/wishlist/check/${productId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setIsWishlisted(response.data.data.isInWishlist);
      }
    } catch (error) {
      console.error("Error checking wishlist:", error);
    } finally {
      setCheckingWishlist(false);
    }
  };

  /* ================= WISHLIST TOGGLE ================= */
  const handleWishlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const token = getToken();
    if (!token) {
      toast.error("Please login to add to wishlist");
      navigate("/login");
      return;
    }

    setWishlistLoading(true);
    try {
      if (isWishlisted) {
        // Remove from wishlist
        const response = await axios.delete(
          `https://ecommerce-server-fhna.onrender.com/api/wishlist/${productId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (response.data.success) {
          setIsWishlisted(false);
          toast.success("Removed from wishlist");
        }
      } else {
        // Add to wishlist
        const response = await axios.post(
          `https://ecommerce-server-fhna.onrender.com/api/wishlist`,
          { productId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data.success) {
          setIsWishlisted(true);
          toast.success("Added to wishlist!");
        }
      }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update wishlist";
      toast.error(message);
      console.error("Wishlist error:", error);
    } finally {
      setWishlistLoading(false);
    }
  };

  /* ================= ADD TO CART ================= */
  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const token = getToken();
    
    if (!token) {
      toast.error("Please login to add items to cart");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
      return;
    }

    setCartLoading(true);
    try {
      const result = await addToCart(productId, 1);
      
      if (result.success) {
        toast.success(result.message || "Added to cart successfully!");
        window.dispatchEvent(new Event('cartUpdated'));
      } else {
        toast.error(result.message || "Failed to add to cart");
        
        if (result.message?.includes('login') || result.message?.includes('token')) {
          setTimeout(() => {
            navigate("/login");
          }, 1500);
        }
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error("Error adding to cart. Please try again.");
      
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } finally {
      setCartLoading(false);
    }
  };

  /* ================= EFFECTS ================= */
  useEffect(() => {
    checkWishlistStatus();
  }, [productId]);

  return (
    <div
      className="
      group bg-white border border-gray-100 rounded-none
      hover:shadow-lg transition-all duration-300
      h-full flex flex-col relative
      w-full max-w-full
    "
    >
      {/* ================= IMAGE ================= */}
      <div className="relative bg-gray-50 overflow-hidden aspect-[4/5]">
        <img
          src={imageFront}
          alt={title}
          className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
        />

        <img
          src={imageBack || imageFront}
          alt={title}
          className="w-full h-full object-cover absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />

        {/* Discount */}
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-semibold px-3 py-1">
            -{discount}%
          </span>
        )}

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
          {/* Wishlist Button */}
          <Button
            onClick={handleWishlistClick}
            disabled={wishlistLoading || checkingWishlist}
            className={`!min-w-0 !w-10 !h-10 !p-0 
              !text-gray-600 hover:!bg-black hover:!text-white 
              opacity-0 translate-x-4 
              group-hover:opacity-100 group-hover:translate-x-0 
              transition-all duration-300 rounded-none
              ${isWishlisted 
                ? '!bg-red-500 !text-white hover:!bg-red-600' 
                : '!bg-white/90'
              }`}
          >
            {wishlistLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
            ) : isWishlisted ? (
              <FaHeart size={16} />
            ) : (
              <FaRegHeart size={16} />
            )}
          </Button>

          {/* Quick View Button */}
          <Button
            onClick={() => navigate(`/productdetails/${productId}`)}
            className="!min-w-0 !w-10 !h-10 !p-0 !bg-white/90 !text-gray-600
            hover:!bg-black hover:!text-white !rounded-none !shadow-sm
            opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 
            transition-all delay-100"
          >
            <MdOutlineZoomOutMap size={16} />
          </Button>
        </div>

        {/* Quick Add to Cart Button */}
        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={handleAddToCart}
            disabled={cartLoading}
            className="w-full bg-black text-white py-3 text-sm font-medium
            tracking-wide opacity-0 translate-y-4
            group-hover:opacity-100 group-hover:translate-y-0
            transition-all duration-300 delay-150 flex items-center justify-center gap-2
            disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cartLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Adding...
              </>
            ) : (
              <>
                <FaShoppingBag size={14} />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>

      {/* ================= INFO ================= */}
      <div className="p-4 flex flex-col flex-1">
        <div className="bg-red-600 text-white text-xs font-semibold px-3 py-1 inline-block mb-3 rounded-full self-start">
          {category}
        </div>

        <h3 className="text-[15px] font-semibold text-gray-900 mb-1 leading-tight line-clamp-2">
          {title}
        </h3>

        {/* Rating */}
        <Rating 
          value={rating} 
          readOnly 
          size="small" 
          className="mb-2" 
        />

        <p className="text-xs text-gray-500 mb-3">
          15W Wireless Output | 22.5W Wired
        </p>

        {/* Price Section */}
        <div className="flex items-center gap-2 mb-1 mt-auto">
          <span className="text-[22px] font-semibold text-black">
            ₹{newPrice}
          </span>

          {oldPrice && (
            <span className="text-sm text-gray-400 line-through">
              ₹{oldPrice}
            </span>
          )}

          {discount > 0 && (
            <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* EMI Option */}
        <p className="text-[13px] text-gray-700 mb-4">
          or Rs. <span className="font-semibold">383</span> /Month
          <span className="text-green-600 ml-1 font-medium cursor-pointer">
            Buy on EMI ›
          </span>
        </p>

        {/* Buy Now Button */}
        <button
          onClick={handleAddToCart}
          disabled={cartLoading}
          className="w-full bg-black text-white py-3 text-sm font-semibold 
          tracking-wide rounded-md hover:bg-gray-800 transition
          disabled:opacity-50 disabled:cursor-not-allowed mt-auto"
        >
          {cartLoading ? "Adding..." : "Buy Now"}
        </button>
      </div>
    </div> 
  );
};

export default ProductCard;