import React, { useEffect, useState } from "react";
import axios from "axios";

const ProductListing = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    category: "",
    size: "",
    color: "",
    brand: "",
  });

  // ------------------------
  // Helpers
  // ------------------------
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key] === value ? "" : value,
    }));
  };

  const getCategoryImage = (category) => {
    if (category.image?.url) return category.image.url;

    const defaultImages = {
      Mobiles: "/homecat/phone.jpg",
      Laptops: "/homecat/laptop.jpg",
      "Mens Fashion": "/homecat/men.jpg",
      "Womens Fashion": "/homecat/women.jpg",
      Kids: "/homecat/kids.jpg",
      Footwear: "/homecat/shoe.jpg",
    };

    return defaultImages[category.name] || "/homecat/default.jpg";
  };

  // ------------------------
  // API Calls
  // ------------------------
  const fetchCategories = async () => {
    try {
      const res = await axios.get("https://ecommerce-server-fhna.onrender.com/api/categories");
      setCategories(res.data.data || []);
    } catch (err) {
      console.error("Category fetch error:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://ecommerce-server-fhna.onrender.com/api/products");
      setProducts(res.data.data?.products || []);
    } catch (err) {
      console.error("Product fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  // ------------------------
  // Filtering
  // ------------------------
  const filteredProducts = products.filter((product) => {
    return (
      (!filters.category || product.category?.name === filters.category) &&
      (!filters.size || product.size === filters.size) &&
      (!filters.color || product.color === filters.color) &&
      (!filters.brand || product.brand === filters.brand)
    );
  });

  // ------------------------
  // UI
  // ------------------------
  return (
    <div className="p-6 space-y-10">

      {/* ---------------- CATEGORY SECTION ---------------- */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Shop by Category</h2>

        {categories.length === 0 ? (
          <p className="text-gray-500">No categories found</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <div
                key={category._id}
                onClick={() =>
                  handleFilterChange("category", category.name)
                }
                className={`relative cursor-pointer rounded-lg overflow-hidden shadow group border
                  ${
                    filters.category === category.name
                      ? "ring-2 ring-black"
                      : ""
                  }
                `}
              >
                <img
                  src={getCategoryImage(category)}
                  alt={category.name}
                  className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => (e.target.src = "/homecat/default.jpg")}
                />

                <div className="absolute inset-0 bg-black/40"></div>

                <h3 className="absolute bottom-2 left-2 text-white font-semibold text-sm">
                  {category.name}
                </h3>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ---------------- FILTERS + PRODUCTS ---------------- */}
      <div className="flex gap-6">

        {/* -------- Sidebar Filters -------- */}
        <div className="w-1/4 bg-white rounded-lg shadow p-4 space-y-6">
          <h3 className="text-lg font-semibold">Filters</h3>

          {/* Size */}
          <div>
            <p className="font-medium mb-2">Sizesss</p>
            <div className="flex flex-wrap gap-2">
              {["S", "M", "L", "XL"].map((size) => (
                <button
                  key={size}
                  onClick={() => handleFilterChange("size", size)}
                  className={`px-3 py-1 border rounded
                    ${
                      filters.size === size
                        ? "bg-black text-white"
                        : "bg-gray-100"
                    }
                  `}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <p className="font-medium mb-2">Color</p>
            <div className="flex gap-2">
              {["black", "red", "blue", "green"].map((color) => (
                <button
                  key={color}
                  onClick={() => handleFilterChange("color", color)}
                  className={`w-6 h-6 rounded-full border
                    ${
                      filters.color === color
                        ? "ring-2 ring-black"
                        : ""
                    }
                  `}
                  style={{ backgroundColor: color }}
                ></button>
              ))}
            </div>
          </div>

          {/* Brand */}
          <div>
            <p className="font-medium mb-2">Brand</p>
            <select
              className="w-full border rounded px-3 py-2"
              value={filters.brand}
              onChange={(e) =>
                handleFilterChange("brand", e.target.value)
              }
            >
              <option value="">All Brands</option>
              <option value="nike">Nike</option>
              <option value="adidas">Adidas</option>
              <option value="puma">Puma</option>
              <option value="zara">Zara</option>
            </select>
          </div>

          {/* Clear Filters */}
          <button
            onClick={() =>
              setFilters({ category: "", size: "", color: "", brand: "" })
            }
            className="w-full bg-gray-200 py-2 rounded hover:bg-gray-300"
          >
            Clear Filters
          </button>
        </div>

        {/* -------- Product Grid -------- */}
        <div className="w-3/4">
          <h3 className="text-lg font-semibold mb-4">Products</h3>

          {loading ? (
            <p className="text-gray-500">Loading products...</p>
          ) : filteredProducts.length === 0 ? (
            <p className="text-gray-500">No products found</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="border rounded-lg shadow p-3 hover:shadow-lg transition"
                >
                  <img
                    src={
                      product.images?.[0]?.url ||
                      "https://via.placeholder.com/300"
                    }
                    alt={product.name}
                    className="w-full h-40 object-cover rounded mb-2"
                  />

                  <h4 className="font-medium text-sm">
                    {product.name}
                  </h4>
                  <p className="text-gray-600 font-semibold">
                    ₹{product.price}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListing;
