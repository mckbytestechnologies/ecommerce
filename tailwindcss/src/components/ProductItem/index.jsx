import React from "react";
import { FaRegHeart, FaShoppingBag } from "react-icons/fa";
import { FaCodeCompare } from "react-icons/fa6";
import { MdOutlineZoomOutMap } from "react-icons/md";

const ProductItem = ({ product }) => {
  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <div className="group bg-white border rounded-lg shadow hover:shadow-lg transition-all relative">
      {/* IMAGE */}
      <div className="relative overflow-hidden aspect-[4/5]">
        <img
          src={product.images?.[0]?.url}
          alt={product.name}
          className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
        />
        <img
          src={product.images?.[1]?.url || product.images?.[0]?.url}
          alt={product.name}
          className="absolute top-0 left-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />

        {/* HOVER ICONS */}
        <div className="absolute top-3 right-3 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all">
          <button className="p-2 bg-white rounded-full shadow hover:bg-gray-100">
            <FaRegHeart size={16} />
          </button>
          <button className="p-2 bg-white rounded-full shadow hover:bg-gray-100">
            <FaCodeCompare size={16} />
          </button>
          <button className="p-2 bg-white rounded-full shadow hover:bg-gray-100">
            <MdOutlineZoomOutMap size={16} />
          </button>
        </div>

        {/* QUICK ADD TO CART */}
        <button className="absolute bottom-4 left-4 right-4 z-20 bg-black text-white py-2 text-sm flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all rounded-md hover:bg-gray-800">
          <FaShoppingBag size={14} /> Add to Cart
        </button>

        {/* DISCOUNT BADGE */}
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded">
            -{discount}%
          </div>
        )}
      </div>

      {/* INFO */}
      <div className="p-4">
        <p className="text-xs font-semibold text-blue-600 mb-1">
          {product.category?.name || "Category"}
        </p>
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
          {product.comparePrice && (
            <span className="text-sm text-gray-400 line-through">₹{product.comparePrice}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
