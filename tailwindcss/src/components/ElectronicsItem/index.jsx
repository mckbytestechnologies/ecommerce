import React from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import { FaRegHeart, FaShoppingBag } from "react-icons/fa";
import { FaCodeCompare } from "react-icons/fa6";
import { MdOutlineZoomOutMap } from "react-icons/md";
import { toast } from "react-hot-toast";

const ElectronicsItem = ({
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

  const discount =
    oldPrice && newPrice
      ? Math.round(((oldPrice - newPrice) / oldPrice) * 100)
      : 0;

  // ⭐ ADD TO WISHLIST API
  const addToWishlist = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/wishlist/add", {
        productId,
      });

      toast.success("Added to wishlist!");
    } catch (err) {
      toast.error("Failed to add to wishlist");
      console.log(err);
    }
  };

  return (
    <div className="group bg-white border border-gray-100 hover:shadow-lg transition-all duration-300 h-full flex flex-col relative">
      {/* IMAGES */}
      <div className="relative bg-gray-50 overflow-hidden aspect-[4/5]">
        <img
          src={imageFront}
          alt={title}
          className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
        />

        <img
          src={imageBack}
          alt={title}
          className="w-full h-full object-cover absolute top-0 left-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />

        {/* DISCOUNT LABEL */}
        {discount > 0 && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-red-600 text-white text-xs font-semibold px-3 py-1">
              -{discount}%
            </span>
          </div>
        )}

        {/* RIGHT SIDE ICON BUTTONS */}
        <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
          
          {/* ❤️ WISHLIST BUTTON */}
          <Button
            onClick={addToWishlist}
            className="!min-w-0 !w-10 !h-10 !p-0 !bg-white/90 
              !text-gray-600 hover:!bg-black hover:!text-white 
              opacity-0 translate-x-4 
              group-hover:opacity-100 group-hover:translate-x-0 
              transition-all duration-300 rounded-none"
          >
            <FaRegHeart size={16} />
          </Button>

          {/* ↔ COMPARE BUTTON */}
          <Button
            onClick={() => toast("Compare feature coming soon")}
            className="!min-w-0 !w-10 !h-10 !p-0 !bg-white/90 
            !text-gray-600 hover:!bg-black hover:!text-white 
            opacity-0 translate-x-4 
            group-hover:opacity-100 group-hover:translate-x-0 
            transition-all duration-300 delay-75 rounded-none"
          >
            <FaCodeCompare size={16} />
          </Button>

          {/* 🔍 ZOOM / GO TO DETAILS */}
          <Button
            onClick={() => navigate(`/productdetails/${productId}`)}
            className="!min-w-0 !w-10 !h-10 !p-0 !bg-white/90 
            !text-gray-600 hover:!bg-black hover:!text-white 
            opacity-0 translate-x-4 
            group-hover:opacity-100 group-hover:translate-x-0 
            transition-all duration-300 delay-100 rounded-none"
          >
            <MdOutlineZoomOutMap size={16} />
          </Button>
        </div>

        {/* ADD TO CART BUTTON (BOTTOM) */}
        <div className="absolute bottom-4 left-4 right-4 z-20">
          <button
            onClick={() => navigate("/cart")}
            className="w-full bg-black text-white py-3 text-sm font-medium tracking-wide 
            opacity-0 translate-y-4 
            group-hover:opacity-100 group-hover:translate-y-0 
            transition-all duration-300 delay-150"
          >
            <FaShoppingBag size={14} className="inline-block mr-2" />
            Add to Cart
          </button>
        </div>
      </div>

      {/* PRODUCT INFO */}
      <div className="p-4 flex flex-col">
        <div className="bg-red-600 text-white text-xs font-semibold px-3 py-1 inline-block mb-3">
          {category}
        </div>

        <h3 className="text-[15px] font-semibold text-gray-900 mb-1 line-clamp-2">
          {title}
        </h3>

        <Rating value={rating} readOnly size="small" className="mb-2" />

        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg font-semibold text-black">₹{newPrice}</span>

          {oldPrice && (
            <span className="text-sm text-gray-400 line-through">
              ₹{oldPrice}
            </span>
          )}
        </div>

        <button
          onClick={() => navigate(`/productdetails/${productId}`)}
          className="w-full bg-black text-white py-3 text-sm font-semibold hover:bg-gray-800"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ElectronicsItem;
