import React from "react";
import { Link } from "react-router-dom";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import { FaRegHeart } from "react-icons/fa";
import { FaCodeCompare } from "react-icons/fa6";
import { MdOutlineZoomOutMap } from "react-icons/md";

const LatestProductItem = ({
  imageFront,
  imageBack,
  category,
  title,
  rating = 0,
  oldPrice,
  newPrice,
}) => {
  return (
    <div className="flex gap-5 flex-wrap latestproductitem relative rounded-xl overflow-hidden shadow-md bg-white hover:shadow-xl transition duration-300">
      {/* Image Section */}
      <div className="imgWrapper relative w-[220px] h-[280px] overflow-hidden group">
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
        <span className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-md shadow">
          -10%
        </span>

        {/* Action Buttons */}
        <div className="action absolute top-[15px] right-[5px] z-50 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button className="!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !bg-white !text-gray-600 hover:!bg-orange-500 hover:!text-white shadow-md">
            <FaRegHeart size={18} />
          </Button>

          <Button className="!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !bg-white !text-gray-600 hover:!bg-orange-500 hover:!text-white shadow-md">
            <FaCodeCompare size={18} />
          </Button>

          <Button className="!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !bg-white !text-gray-600 hover:!bg-orange-500 hover:!text-white shadow-md">
            <MdOutlineZoomOutMap size={18} />
          </Button>
        </div>
      </div>

      {/* Info Section */}
      <div className="info p-4 bg-gray-50">
        <h6 className="text-xs uppercase text-gray-500 tracking-wide">
          <Link to="/" className="hover:text-orange-500 transition">
            {category}
          </Link>
        </h6>
        <h3 className="text-sm font-medium mt-1 text-gray-800">
          <Link to="/" className="hover:text-orange-500 transition">
            {title}
          </Link>
        </h3>

        {/* Rating */}
        <div className="mt-2">
          <Rating name="size-small" value={rating} size="small" readOnly />
        </div>

        {/* Price */}
        <div className="flex items-center gap-3 mt-2">
          {oldPrice && (
            <span className="line-through text-gray-400 text-sm">₹{oldPrice}</span>
          )}
          <span className="text-orange-500 font-semibold text-sm">₹{newPrice}</span>
        </div>
      </div>
    </div>
  );
};

export default LatestProductItem;
