import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Furnitureitem from "../Furnitureitem";

const Furnitureslider = ({ items = 5 }) => {
  const products = [
  {
    imageFront: "https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg",
    imageBack: "https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg",
    category: "Sofas",
    title: "Modern L-Shaped Leather Sofa",
    rating: 5,
    oldPrice: 1299.0,
    newPrice: 1099.0,
  },
  {
    imageFront: "https://plus.unsplash.com/premium_photo-1671594183111-b4c24e21af8e?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    imageBack: "https://plus.unsplash.com/premium_photo-1671594183111-b4c24e21af8e?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Dining Tables",
    title: "Oak Wood Dining Table Set – 6 Chairs",
    rating: 4,
    oldPrice: 799.0,
    newPrice: 699.0,
  },
  {
    imageFront: "https://images.unsplash.com/flagged/photo-1556438758-8d49568ce18e?q=80&w=874&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    imageBack: "https://images.unsplash.com/flagged/photo-1556438758-8d49568ce18e?q=80&w=874&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Beds",
    title: "Queen Size Platform Bed Frame",
    rating: 5,
    oldPrice: 1099.0,
    newPrice: 949.0,
  },
  {
    imageFront: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=465&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    imageBack: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=465&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Chairs",
    title: "Ergonomic Office Chair with Lumbar Support",
    rating: 4,
    oldPrice: 299.0,
    newPrice: 249.0,
  },
  {
    imageFront: "https://plus.unsplash.com/premium_photo-1670359036016-3fc5bde40db6?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    imageBack: "https://plus.unsplash.com/premium_photo-1670359036016-3fc5bde40db6?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Wardrobes",
    title: "3-Door Sliding Wardrobe with Mirror",
    rating: 5,
    oldPrice: 899.0,
    newPrice: 749.0,
  },
  {
    imageFront: "https://plus.unsplash.com/premium_photo-1683141333921-b48175002172?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    imageBack: "https://plus.unsplash.com/premium_photo-1683141333921-b48175002172?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Coffee Tables",
    title: "Glass Top Coffee Table with Storage",
    rating: 4,
    oldPrice: 249.0,
    newPrice: 199.0,
  },
  {
    imageFront: "https://plus.unsplash.com/premium_photo-1664302386657-708e15ab9691?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    imageBack: "https://plus.unsplash.com/premium_photo-1664302386657-708e15ab9691?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "TV Units",
    title: "Modern TV Cabinet with Drawers",
    rating: 5,
    oldPrice: 599.0,
    newPrice: 499.0,
  },
];


  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 border-b border-gray-100 pb-6">
          <div className="text-center lg:text-left mb-6 lg:mb-0">
            <h2 className="text-3xl font-light text-gray-900 tracking-tight mb-2">
              Trending Furnitures
            </h2>
            <p className="text-gray-500 font-light">
              Explore the latest gadgets and tech innovations of 2025
            </p>
          </div>
          
          {/* Navigation Controls */}
          <div className="flex items-center justify-center lg:justify-end space-x-3">
            <button className="custom-prev w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="custom-next w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Slider */}
        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation={{
              nextEl: ".custom-next",
              prevEl: ".custom-prev",
            }}
            pagination={{
              clickable: true,
              el: ".custom-pagination",
              bulletClass: "custom-bullet",
              bulletActiveClass: "custom-bullet-active",
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            speed={600}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              480: { slidesPerView: 2, spaceBetween: 20 },
              768: { slidesPerView: 3, spaceBetween: 24 },
              1024: { slidesPerView: 4, spaceBetween: 24 },
              1280: { slidesPerView: 5, spaceBetween: 24 },
            }}
            className="!pb-12"
          >
            {products.map((product, index) => (
              <SwiperSlide key={index} className="!h-auto">
                <div className="h-full px-2 py-4">
                  <Furnitureitem {...product} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Pagination */}
          <div className="custom-pagination flex justify-center gap-2 mt-8 !relative" />
        </div>
      </div>

      <style jsx>{`
        .custom-bullet {
          width: 8px;
          height: 8px;
          background: #d1d5db;
          border-radius: 50%;
          opacity: 0.6;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .custom-bullet-active {
          width: 24px;
          background: #000;
          opacity: 1;
          border-radius: 6px;
        }
      `}</style>
    </div>
  );
};

export default Furnitureslider;
