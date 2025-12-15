import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import ProductItem from "../ProductItem";
import axios from "axios";

const ProductSlider = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/categories");
        console.log("Categories API Response:", res.data);
        setCategories(res.data.data || []); // assuming API returns { data: [...] }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-semibold text-gray-900 mb-6">
        All Categories
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {categories.length === 0 && <p className="text-gray-500">No categories found</p>}

        {categories.map((category) => (
          <div
            key={category._id}
            className="flex flex-col items-center justify-center border rounded-lg p-4 hover:shadow-lg transition-all"
          >
            <img
              src={category.image?.url || "https://via.placeholder.com/150"}
              alt={category.name}
              className="w-20 h-20 object-cover mb-2 rounded-full"
            />
            <h3 className="text-sm font-medium text-gray-900 text-center">
              {category.name}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ProductSlider;
