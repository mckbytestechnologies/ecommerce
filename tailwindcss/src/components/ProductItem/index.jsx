import React from "react";
import { Link } from "react-router-dom";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import { FaRegHeart, FaShoppingBag } from "react-icons/fa";
import { FaCodeCompare } from "react-icons/fa6";
import { MdOutlineZoomOutMap } from "react-icons/md";

const ProductItem = ({
  imageFront,
  imageBack,
  category,
  title,
  rating = 0,
  oldPrice,
  newPrice,
  badge
}) => {
  const discount = oldPrice ? Math.round(((oldPrice - newPrice) / oldPrice) * 100) : 0;

  return (
    <div className="group bg-white border border-gray-100 rounded-none hover:shadow-sm transition-all duration-300 h-full flex flex-col relative">
      {/* Image Container */}
      <div className="relative bg-gray-50 overflow-hidden aspect-square">
        {/* Main Image */}
        <div className="relative w-full h-full">
          <img
            src={imageFront}
            alt="Product Front"
            className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
          />
          <img
            src={imageBack}
            alt="Product Back"
            className="w-full h-full object-cover absolute top-0 left-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        </div>

        {/* Badge */}
        {badge && (
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-black text-white px-3 py-1 text-xs font-medium tracking-wide">
              {badge}
            </span>
          </div>
        )}

        {/* Discount Badge */}
        {oldPrice && (
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-red-600 text-white px-2 py-1 text-xs font-medium">
              -{discount}%
            </span>
          </div>
        )}

        {/* Action Buttons - Fixed positioning */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
          <Button 
            className="!min-w-0 !w-8 !h-8 !p-0 !bg-white !text-gray-600 hover:!bg-black hover:!text-white !rounded-none !shadow-sm opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
            size="small"
          >
            <FaRegHeart size={12} />
          </Button>
          <Button 
            className="!min-w-0 !w-8 !h-8 !p-0 !bg-white !text-gray-600 hover:!bg-black hover:!text-white !rounded-none !shadow-sm opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 delay-75"
            size="small"
          >
            <FaCodeCompare size={12} />
          </Button>
          <Button 
            className="!min-w-0 !w-8 !h-8 !p-0 !bg-white !text-gray-600 hover:!bg-black hover:!text-white !rounded-none !shadow-sm opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 delay-100"
            size="small"
          >
            <MdOutlineZoomOutMap size={12} />
          </Button>
        </div>

        {/* Quick Add Button */}
        <div className="absolute bottom-4 left-4 right-4 z-20">
          <button className="w-full bg-black text-white py-3 text-sm font-medium tracking-wide opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-150 flex items-center justify-center gap-2 hover:bg-gray-800">
            <FaShoppingBag size={12} />
            Add to Cart
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="mb-2">
          <span className="text-xs text-gray-500 font-light tracking-wide uppercase">
            {category}
          </span>
        </div>
        
        <h3 className="text-lg font-light text-gray-900 mb-3 leading-tight tracking-tight line-clamp-2">
          <Link to="/" className="hover:text-gray-600 transition-colors">
            {title}
          </Link>
        </h3>

        <div className="mt-auto">
          <div className="flex items-center space-x-1 mb-3">
            <Rating 
              value={rating} 
              size="small" 
              readOnly 
              precision={0.1}
              className="!text-sm"
            />
            <span className="text-xs text-gray-500">({rating})</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {oldPrice && (
                <span className="text-sm text-gray-400 line-through font-light">
                  ₹{oldPrice}
                </span>
              )}
              <span className="text-xl font-light text-gray-900">
                ₹{newPrice}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;