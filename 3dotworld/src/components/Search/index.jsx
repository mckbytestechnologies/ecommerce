import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MdSearch } from "react-icons/md";

const Search = () => {
  const navigate = useNavigate();
  const wrapperRef = useRef(null);

  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // ---------------------------
  // Fetch search results
  // ---------------------------
  useEffect(() => {
    if (!query.trim()) {
      setProducts([]);
      setCategories([]);
      return;
    }

    const fetchResults = async () => {
      try {
        setLoading(true);

        const [productRes, categoryRes] = await Promise.all([
          axios.get(`https://ecommerce-server-fhna.onrender.com/api/products?search=${query}`),
          axios.get(`https://ecommerce-server-fhna.onrender.com/api/categories?search=${query}`)
        ]);

        setProducts(productRes.data?.data?.products || []);
        setCategories(categoryRes.data?.data || []);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    };

    const delay = setTimeout(fetchResults, 300);
    return () => clearTimeout(delay);
  }, [query]);

  // ---------------------------
  // Close dropdown on outside click
  // ---------------------------
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ---------------------------
  // Navigation handlers
  // ---------------------------
  const goToProduct = (id) => {
    setOpen(false);
    setQuery("");
    navigate(`/product/${id}`);
  };

  const goToCategory = (name) => {
    setOpen(false);
    setQuery("");
    navigate(`/products?category=${encodeURIComponent(name)}`);
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      {/* Input */}
      <div className="flex items-center bg-gray-100 rounded-lg px-3">
        <MdSearch className="text-gray-500 text-xl" />
        <input
          type="text"
          placeholder="Search for products, brands & categories..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          className="w-full bg-transparent px-3 py-2 text-sm outline-none"
        />
      </div>

      {/* Dropdown */}
      {open && (query || loading) && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-xl rounded-lg mt-2 z-50 max-h-[420px] overflow-y-auto border">

          {loading && (
            <p className="p-4 text-sm text-gray-500">Searching...</p>
          )}

          {/* Categories */}
          {categories.length > 0 && (
            <div className="p-2">
              <p className="text-xs font-semibold text-gray-500 px-2 mb-1">
                Categories
              </p>
              {categories.map((cat) => (
                <div
                  key={cat._id}
                  onClick={() => goToCategory(cat.name)}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-red-50 cursor-pointer rounded"
                >
                  <img
                    src={cat.image?.url || "/homecat/default.jpg"}
                    alt={cat.name}
                    className="w-8 h-8 rounded object-cover"
                  />
                  <span className="text-sm font-medium">
                    {cat.name}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Products */}
          {products.length > 0 && (
            <div className="p-2 border-t">
              <p className="text-xs font-semibold text-gray-500 px-2 mb-1">
                Products
              </p>
              {products.map((product) => (
                <div
                  key={product._id}
                  onClick={() => goToProduct(product._id)}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-red-50 cursor-pointer rounded"
                >
                  <img
                    src={product.images?.[0]?.url || "/placeholder.png"}
                    alt={product.name}
                    className="w-10 h-10 rounded object-cover"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium line-clamp-1">
                      {product.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      ₹{product.price}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No results */}
          {!loading && products.length === 0 && categories.length === 0 && (
            <p className="p-4 text-sm text-gray-500">
              No results found
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
