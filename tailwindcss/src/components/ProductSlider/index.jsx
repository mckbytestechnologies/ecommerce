import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Navigation, Pagination } from "swiper/modules";
import ProductItem from "../ProductItem";

const ProductSlider = ({ items = 5 }) => {
  const products = [
    {
      imageFront: "/productitem/productitem1.jpg",
      imageBack: "/productitem/productitem2.jpg",
      category: "I Phone",
      title: "MAYNOS Suction Phone Case Mount ",
      rating: 4,
      oldPrice: 58.0,
      newPrice: 48.0,
    },
    {
      imageFront: "/productitem/productitem3.jpg",
      imageBack: "/productitem/productitem4.jpg",
      category: "Samsung",
      title: "Galaxy S22 Ultra Protective Case",
      rating: 5,
      oldPrice: 60.0,
      newPrice: 50.0,
    },
    {
      imageFront: "/productitem/productitem5.jpg",
      imageBack: "/productitem/productitem6.jpg",
      category: "Accessories",
      title: "Wireless Charging Pad Stand",
      rating: 3,
      oldPrice: 30.0,
      newPrice: 25.0,
    },
    {
      imageFront: "/productitem/productitem7.jpg",
      imageBack: "/productitem/productitem8.jpg",
      category: "Headphones",
      title: "Noise Cancelling Bluetooth Headphones",
      rating: 4,
      oldPrice: 80.0,
      newPrice: 70.0,
    },
    {
      imageFront: "/productitem/productitem9.jpg",
      imageBack: "/productitem/productitem10.jpg",
      category: "Smartwatch",
      title: "Fitness Tracker Smartwatch with Heart Rate Monitor",
      rating: 4,
      oldPrice: 100.0,
      newPrice: 90.0,
    },
    {
      imageFront: "/productitem/productitem11.jpg",
      imageBack: "/productitem/productitem12.jpg",
      category: "Smartwatch",
      title: "Fitness Tracker Smartwatch with Heart Rate Monitor",
      rating: 4,
      oldPrice: 100.0,
      newPrice: 90.0,
    },
    {
      imageFront: "/productitem/productitem13.jpg",
      imageBack: "/productitem/productitem14.jpg",
      category: "Smartwatch",
      title: "Fitness Tracker Smartwatch with Heart Rate Monitor",
      rating: 4,
      oldPrice: 100.0,
      newPrice: 90.0,
    },
    {
      imageFront: "/productitem/productitem15.jpg",
      imageBack: "/productitem/productitem16.jpg",
      category: "Smartwatch",
      title: "Fitness Tracker Smartwatch with Heart Rate Monitor",
      rating: 4,
      oldPrice: 100.0,
      newPrice: 90.0,
    },
  ];

  return (
    <div className="productslider py-5">
      <Swiper
        slidesPerView={items}
        spaceBetween={10}
        pagination={{ clickable: true }}
        navigation={{ nextEl: ".custom-next", prevEl: ".custom-prev" }}
        modules={[Navigation, Pagination]}
        className="mySwiper"
      >
        {products.map((product, index) => (
          <SwiperSlide key={index}>
            <ProductItem {...product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductSlider;
