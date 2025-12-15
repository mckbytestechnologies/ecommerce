import React, { useState } from "react";

const ProductListing = () => {
  const [filters, setFilters] = useState({
    category: "",
    size: "",
    color: "",
    brand: "",
  });

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <div className="flex gap-6 p-6">
      {/* Sidebar Filters */}
      <div className="w-1/4 bg-white rounded-lg shadow p-4 space-y-6">
        <h2 className="text-xl font-semibold mb-4">Filters</h2>

        {/* Category */}
        <div>
          <h3 className="font-medium mb-2">Category</h3>
          <div className="space-y-2">
            <label className="block">
              <input
                type="radio"
                name="category"
                value="mens"
                onChange={(e) => handleFilterChange("category", e.target.value)}
              />{" "}
              Men’s Fashion
            </label>
            <label className="block">
              <input
                type="radio"
                name="category"
                value="womens"
                onChange={(e) => handleFilterChange("category", e.target.value)}
              />{" "}
              Women’s Fashion
            </label>
          </div>
        </div>

        {/* Size */}
        <div>
          <h3 className="font-medium mb-2">Size</h3>
          <div className="flex flex-wrap gap-2">
            {["S", "M", "L", "XL"].map((size) => (
              <button
                key={size}
                onClick={() => handleFilterChange("size", size)}
                className={`px-3 py-1 rounded border ${
                  filters.size === size ? "bg-black text-white" : "bg-gray-100"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Color */}
        <div>
          <h3 className="font-medium mb-2">Color</h3>
          <div className="flex gap-2">
            {["black", "red", "blue", "green"].map((color) => (
              <button
                key={color}
                onClick={() => handleFilterChange("color", color)}
                className={`w-6 h-6 rounded-full border ${
                  filters.color === color ? "ring-2 ring-black" : ""
                }`}
                style={{ backgroundColor: color }}
              ></button>
            ))}
          </div>
        </div>

        {/* Brand */}
        <div>
          <h3 className="font-medium mb-2">Brand</h3>
          <select
            onChange={(e) => handleFilterChange("brand", e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select Brand</option>
            <option value="nike">Nike</option>
            <option value="adidas">Adidas</option>
            <option value="puma">Puma</option>
            <option value="zara">Zara</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="w-3/4">
        <h2 className="text-xl font-semibold mb-4">Products</h2>
        <div className="grid grid-cols-3 gap-6">
          {/* Example product card */}
          <div className="border rounded-lg shadow p-4 text-center">
            <img
              src="https://via.placeholder.com/200"
              alt="Product"
              className="w-full h-40 object-cover mb-2 rounded"
            />
            <h3 className="font-medium">Men’s T-Shirt</h3>
            <p className="text-gray-600">₹999</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListing;
