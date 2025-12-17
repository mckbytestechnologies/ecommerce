import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import axios from "axios";
import ProductCard from "../ProductCard";


const CategorySlider = ({ category }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/products?category=${category._id}`)
      .then((res) => setProducts(res.data?.data?.products || []))
      .catch(console.error);
  }, [category]);

  if (!products.length) return null;

  return (
    <section className="bg-white py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-6">
          {category.name}
        </h2>

        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 3000 }}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
        >
          {products.map((p) => (
            <SwiperSlide key={p._id}>
              <ProductCard
                productId={p._id}
                imageFront={p.images?.[0]?.url}
                imageBack={p.images?.[1]?.url || p.images?.[0]?.url}
                title={p.name}
                category={category.name}
                rating={p.averageRating}
                oldPrice={p.comparePrice}
                newPrice={p.price}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default CategorySlider;
