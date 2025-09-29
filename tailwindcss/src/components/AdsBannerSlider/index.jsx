import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./swiper.css"; // your custom overrides

import { Navigation, Pagination } from "swiper/modules";
import Bannerbox from "../BannerBox";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const AdsBannerSlider = ({ items = 3 }) => {
  return (
    <div className="relative w-full">
      <Swiper
        slidesPerView={items}
        spaceBetween={15}
        pagination={{
          clickable: true,
        }}
        navigation={{
          nextEl: ".custom-next",
          prevEl: ".custom-prev",
        }}
        modules={[Navigation, Pagination]}
        className="mySwiper"
      >
        {/* Slides */}
        {[
          "/ad_banner/banner1.jpg",
          "/ad_banner/banner2.jpg",
          "/ad_banner/banner3.jpg",
          "/ad_banner/banner4.jpg",
          "/ad_banner/banner5.jpg",
          "/ad_banner/banner6.jpg",
          "/ad_banner/banner7.jpg",
          "/ad_banner/banner8.jpg",
        ].map((img, idx) => (
          <SwiperSlide key={idx}>
            <Bannerbox img={img} />
          </SwiperSlide>
        ))}

        {/* Custom Navigation Buttons */}
        <div className="custom-prev absolute top-1/2 left-3 z-10 -translate-y-1/2 cursor-pointer p-3 bg-black/50 hover:bg-red-500 text-white rounded-full shadow-lg transition">
          <FaArrowLeft size={18} />
        </div>
        <div className="custom-next absolute top-1/2 right-3 z-10 -translate-y-1/2 cursor-pointer p-3 bg-black/50 hover:bg-red-500 text-white rounded-full shadow-lg transition">
          <FaArrowRight size={18} />
        </div>
      </Swiper>
    </div>
  );
};

export default AdsBannerSlider;
