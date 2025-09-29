import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Navigation, Pagination } from "swiper/modules";
import LatestProductItem from "../LatestProductItem";

const LatestProductSlider = ({ items = 5 }) => {
  const products = [
  {
    imageFront: "latestproduct/1.jpg",
    imageBack: "latestproduct/2.jpg",
    category: "Gaming",
    title: "PlayStation 5 DualSense Edge Wireless Controller",
    rating: 5,
    oldPrice: 249.0,
    newPrice: 219.0,
  },
  {
    imageFront: "latestproduct/3.jpg",
    imageBack: "latestproduct/4.jpg",
    category: "Smart Home",
    title: "Amazon Echo Show 10 (3rd Gen)",
    rating: 4,
    oldPrice: 299.0,
    newPrice: 269.0,
  },
  {
    imageFront: "latestproduct/6.jpg",
    imageBack: "latestproduct/5.jpg",
    category: "Cameras",
    title: "GoPro HERO12 Black Action Camera",
    rating: 5,
    oldPrice: 499.0,
    newPrice: 449.0,
  },
  {
    imageFront: "latestproduct/7.jpg",
    imageBack: "latestproduct/8.jpg",
    category: "Audio",
    title: "Bose SoundLink Flex Bluetooth Speaker",
    rating: 4,
    oldPrice: 179.0,
    newPrice: 149.0,
  },
  {
    imageFront: "latestproduct/1.jpg",
    imageBack: "latestproduct/1.jpg",
    category: "Fitness",
    title: "Fitbit Charge 6 Fitness & Health Tracker",
    rating: 4,
    oldPrice: 159.0,
    newPrice: 139.0,
  },
  {
    imageFront: "latestproduct/9.jpg",
    imageBack: "latestproduct/10.jpg",
    category: "Computers",
    title: "Razer Huntsman Mini RGB Gaming Keyboard",
    rating: 5,
    oldPrice: 129.0,
    newPrice: 99.0,
  },
  {
    imageFront: "latestproduct/1.jpg",
    imageBack: "latestproduct/1.jpg",
    category: "Wearables",
    title: "Oura Ring Gen 3 – Smart Health Ring",
    rating: 4,
    oldPrice: 349.0,
    newPrice: 329.0,
  },
  {
    imageFront: "latestproduct/1.jpg",
    imageBack: "latestproduct/1.jpg",
    category: "Drones",
    title: "DJI Mini 4 Pro – Lightweight 4K Drone",
    rating: 5,
    oldPrice: 999.0,
    newPrice: 899.0,
  },
];

  

  return (
    <div className="LatestProductItem py-5">
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
            <LatestProductItem {...product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default LatestProductSlider;
