import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import axios from "axios";
import ElectronicsItem from "../ElectronicsItem";

const ElectronicsSlider = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("https://ecommerce-server-fhna.onrender.com/api/products");
      setProducts(res.data.data?.products || []);
    } catch (err) {
      console.log("API error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4">

        {/* HEADER */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-light text-gray-900">Trending Electronics</h2>
            <p className="text-gray-500">Explore the latest gadgets</p>
          </div>

          {/* NAVIGATION BUTTONS */}
          <div className="flex gap-3">
            <button className="custom-prev w-12 h-12 border rounded-full flex items-center justify-center">
              ⬅
            </button>
            <button className="custom-next w-12 h-12 border rounded-full flex items-center justify-center">
              ➜
            </button>
          </div>
        </div>

        {/* PRODUCT SLIDER */}
        {loading ? (
          <p className="text-center text-gray-500">Loading products…</p>
        ) : (
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation={{
              nextEl: ".custom-next",
              prevEl: ".custom-prev",
            }}
            autoplay={{ delay: 3000 }}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
          >
            {products.map((product) => (
              <SwiperSlide key={product._id}>
                <ElectronicsItem
                  productId={product._id}
                  imageFront={product.images?.[0]?.url}
                  imageBack={product.images?.[1]?.url || product.images?.[0]?.url}
                  title={product.name}
                  category={product.category?.name}
                  rating={product.averageRating}
                  oldPrice={product.comparePrice}
                  newPrice={product.price}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </div>
  );
};

export default ElectronicsSlider;
