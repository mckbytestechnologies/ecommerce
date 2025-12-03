import React from "react";
import { Link } from "react-router-dom";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import { FaRegHeart, FaShoppingBag } from "react-icons/fa";
import { FaCodeCompare } from "react-icons/fa6";
import { MdOutlineZoomOutMap } from "react-icons/md";

const Jewelleryitem = ({
  imageFront,
  imageBack,
  category,
  title,
  rating = 0,
  oldPrice,
  newPrice,
}) => {
  const discount = oldPrice ? Math.round(((oldPrice - newPrice) / oldPrice) * 100) : 0;

  return (
    <div className="group bg-white border border-gray-100 rounded-none hover:shadow-lg transition-all duration-300 h-full flex flex-col relative">
      {/* Image Section */}
      <div className="relative bg-gray-50 overflow-hidden aspect-[4/5]">
        {/* Default Image */}
        <img
          src={imageFront}
          alt="Product Front"
          className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
        />

        {/* Hover Image */}
        <img
          src={imageBack}
          alt="Product Back"
          className="w-full h-full object-cover absolute top-0 left-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />

        {/* Discount Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-red-600 text-white text-xs font-semibold px-3 py-1">
            -{discount}%
          </span>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
          <Button 
            className="!min-w-0 !w-10 !h-10 !p-0 !bg-white/90 !text-gray-600 hover:!bg-black hover:!text-white !rounded-none !shadow-sm opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
          >
            <FaRegHeart size={16} />
          </Button>

          <Button 
            className="!min-w-0 !w-10 !h-10 !p-0 !bg-white/90 !text-gray-600 hover:!bg-black hover:!text-white !rounded-none !shadow-sm opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 delay-75"
          >
            <FaCodeCompare size={16} />
          </Button>

          <Button 
            className="!min-w-0 !w-10 !h-10 !p-0 !bg-white/90 !text-gray-600 hover:!bg-black hover:!text-white !rounded-none !shadow-sm opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 delay-100"
          >
            <MdOutlineZoomOutMap size={16} />
          </Button>
        </div>

        {/* Quick Add Button */}
        <div className="absolute bottom-4 left-4 right-4 z-20">
          <button className="w-full bg-black text-white py-3 text-sm font-medium tracking-wide opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-150 flex items-center justify-center gap-2 hover:bg-gray-800">
            <FaShoppingBag size={14} />
            Add to Cart
          </button>
        </div>
      </div>

      {/* Info Section */}
       <div className="p-4 flex flex-col">

        {/* Top Red Label */}
        <div className="bg-red-600 text-white text-xs font-semibold px-3 py-1 inline-block mb-3 rounded-full">
          {category}
        </div>

        {/* Title */}
        <h3 className="text-[15px] font-semibold text-gray-900 mb-1 leading-tight line-clamp-2">
          {title}
        </h3>

        {/* Subtitle */}
        <p className="text-xs text-gray-500 mb-3">
          15W Wireless Output | 22.5W Wired
        </p>

        {/* Price Section */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[22px] font-semibold text-black">
            ₹{newPrice}
          </span>

          {oldPrice && (
            <span className="text-sm text-gray-400 line-through">
              ₹{oldPrice}
            </span>
          )}

          {/* Discount Badge */}
          <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            {discount}% OFF
          </span>
        </div>

        {/* EMI Line */}
        <p className="text-[13px] text-gray-700 mb-4">
          or Rs. <span className="font-semibold">383</span> /Month
          <span className="text-green-600 ml-1 font-medium cursor-pointer">
            Buy on EMI ›
          </span>
        </p>

        {/* Add to Cart Button */}
        <button className="w-full bg-black text-white py-3 text-sm font-semibold tracking-wide rounded-md hover:bg-gray-800 transition">
          Buy Now
        </button>

      </div>

    </div>
  );
};

export default Jewelleryitem;