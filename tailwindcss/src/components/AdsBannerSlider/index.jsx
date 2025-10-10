import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import "./swiper.css";

import { Pagination, Autoplay } from "swiper/modules";
import Bannerbox from "../BannerBox";

const AdsBannerSlider = ({ items = 3 }) => {
  const banners = [
    "/ad_banner/banner1.jpg",
    "/ad_banner/banner2.jpg",
    "/ad_banner/banner3.jpg",
    "/ad_banner/banner4.jpg",
    "/ad_banner/banner5.jpg",
    "/ad_banner/banner6.jpg",
    "/ad_banner/banner7.jpg",
    "/ad_banner/banner8.jpg",
  ];

  return (
    <div className="w-full bg-white py-8 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Minimal Header */}
        <div className="text-center mb-8 lg:mb-12">
          <h2 className="text-2xl lg:text-3xl font-light text-gray-900 tracking-tight">
            Featured Collections
          </h2>
          <div className="w-16 h-0.5 bg-gray-300 mx-auto mt-4"></div>
        </div>

        {/* Slider Container */}
        <div className="relative">
          <Swiper
            slidesPerView={1}
            spaceBetween={16}
            pagination={{
              clickable: true,
              dynamicBullets: true,
              el: '.custom-pagination',
              bulletClass: 'custom-bullet',
              bulletActiveClass: 'custom-bullet-active',
            }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            modules={[Pagination, Autoplay]}
            className="adsBannerSwiper"
            breakpoints={{
              // Mobile First - All banners same size
              320: {
                slidesPerView: 1.1,
                spaceBetween: 16
              },
              480: {
                slidesPerView: 1.5,
                spaceBetween: 20
              },
              640: {
                slidesPerView: 2.1,
                spaceBetween: 24
              },
              768: {
                slidesPerView: 2.5,
                spaceBetween: 24
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 32
              },
              1280: {
                slidesPerView: items,
                spaceBetween: 32
              },
              1536: {
                slidesPerView: Math.min(4, items),
                spaceBetween: 32
              }
            }}
            speed={800}
            loop={true}
            grabCursor={false}
            centeredSlides={false}
            slideToClickedSlide={false}
          >
            {banners.map((img, idx) => (
              <SwiperSlide key={idx}>
                <div className="h-full flex">
                  <div className="w-full aspect-[4/3] bg-gray-100 overflow-hidden rounded-none shadow-sm hover:shadow-md transition-all duration-500 group">
                    <Bannerbox 
                      img={img} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {/* Subtle overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/2 transition-all duration-300 pointer-events-none" />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Minimal Pagination */}
          <div className="custom-pagination flex justify-center gap-1.5 mt-8 lg:mt-12 !relative" />
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mt-6 lg:mt-8">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>Scroll to explore</span>
            <div className="w-12 h-px bg-gray-300 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-3 h-px bg-gray-500 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdsBannerSlider;