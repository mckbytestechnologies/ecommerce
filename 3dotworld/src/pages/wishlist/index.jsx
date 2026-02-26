import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaRegHeart } from "react-icons/fa";
import ProductCard from "../../components/ProductCard";
import { useWishlist } from "../../contexts/WishlistContext";

// Replace this with your actual backend URL
const BACKEND_URL = "http://localhost:5000";

// Utility function to get full image URL
const getImageUrl = (img) => {
  if (!img) return "https://via.placeholder.com/400x500?text=No+Image";

  // If img is an object
  if (typeof img === "object") {
    img = img.url || img.path || "";
  }

  if (typeof img !== "string") {
    return "https://via.placeholder.com/400x500?text=No+Image";
  }

  if (img.startsWith("http")) return img;

  if (!img.startsWith("/")) img = "/" + img;

  return `${BACKEND_URL}${img}`;
};

const WishlistPage = () => {
  const navigate = useNavigate();
  const {
    wishlist,
    productDetails,
    loading,
    fetchWishlist,
    getWishlistCount,
  } = useWishlist();

  const fetchedOnce = useRef(false);

  useEffect(() => {
    if (!fetchedOnce.current) {
      fetchWishlist();
      fetchedOnce.current = true;
    }
  }, []);

  useEffect(() => {
    console.log("Wishlist data:", wishlist);
    console.log("Product details:", productDetails);
  }, [wishlist, productDetails]);

  // Loading state
  if (loading && wishlist.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-100 border-t-red-600 rounded-full animate-spin" />
      </div>
    );
  }

  // Empty wishlist
  if (getWishlistCount() === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-10 rounded-xl text-center shadow-md max-w-md w-full">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <FaRegHeart className="text-red-500 text-3xl" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-6">Save your favorite items here.</p>
          <button
            onClick={() => navigate("/products")}
            className="w-full bg-red-600 text-white py-3 font-semibold rounded-md hover:bg-red-700 transition"
          >
            Explore Products
          </button>
        </div>
      </div>
    );
  }

  // Main wishlist grid
  return (
    <div className="min-h-screen bg-[#fcfcfc] pb-20">
      {/* HEADER */}
      <div className="bg-white border-b sticky top-0 z-20">
        <div className="container mx-auto px-4 py-5 flex justify-between items-center">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-sm text-gray-500 hover:text-red-600 mb-1"
            >
              <FaArrowLeft className="mr-2" /> Back
            </button>
            <h1 className="text-3xl font-bold">
              My <span className="text-red-600">Wishlist</span>
              <span className="ml-3 px-3 py-1 bg-red-100 text-red-600 text-sm rounded-full">
                {getWishlistCount()}
              </span>
            </h1>
          </div>
        </div>
      </div>

      {/* PRODUCT GRID */}
      <div className="container mx-auto px-4 mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((item) => {
            // Determine product object
            let product;

            if (item.product && typeof item.product === "object") {
              product = item.product;
            } else if (item.product && productDetails && productDetails[item.product]) {
              product = productDetails[item.product];
            } else if (item.images || item.name) {
              product = item;
            } else if (item.productId && productDetails && productDetails[item.productId]) {
              product = productDetails[item.productId];
            } else if (item._id && productDetails && productDetails[item._id]) {
              product = productDetails[item._id];
            }

            if (!product) return null;

            // Handle images
            const images = Array.isArray(product.images)
              ? product.images
              : product.image
              ? [product.image]
              : [];
            const imageFront = getImageUrl(images[0]);
            const imageBack = getImageUrl(images[1] || images[0]);

            return (
              <ProductCard
                key={product._id || product.id || item._id}
                productId={product._id || product.id || item.product || item.productId}
                imageFront={imageFront}
                imageBack={imageBack}
                category={product.category || "Uncategorized"}
                title={product.name || product.title || "Untitled Product"}
                rating={product.rating || product.averageRating || 0}
                oldPrice={product.originalPrice || product.oldPrice || product.price}
                newPrice={product.price || product.newPrice || product.originalPrice}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
