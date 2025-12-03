import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Footwareitem from "../Footwareitem";

const Footwareslider = ({ items = 5 }) => {
  const products = [
  {
    imageFront: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?q=80&w=725&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    imageBack: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?q=80&w=725&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Sneakers",
    title: "Nike Air Max 270 React",
    rating: 5,
    oldPrice: 179.0,
    newPrice: 149.0,
  },
  {
    imageFront: "https://images.unsplash.com/photo-1651013691313-81b822df0044?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    imageBack: "https://images.unsplash.com/photo-1651013691313-81b822df0044?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Running Shoes",
    title: "Adidas Ultraboost 22 Performance Runner",
    rating: 5,
    oldPrice: 199.0,
    newPrice: 169.0,
  },
  {
    imageFront: "https://images.unsplash.com/photo-1576884456974-5d4f358a61c4?q=80&w=435&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    imageBack: "https://images.unsplash.com/photo-1576884456974-5d4f358a61c4?q=80&w=435&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Formal Shoes",
    title: "Clarks Tilden Cap Leather Oxfords",
    rating: 4,
    oldPrice: 149.0,
    newPrice: 119.0,
  },
  {
    imageFront: "https://images.unsplash.com/photo-1699198489130-2e02f3726612?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    imageBack: "https://images.unsplash.com/photo-1699198489130-2e02f3726612?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Casual Shoes",
    title: "Vans Old Skool Low-Top Sneakers",
    rating: 5,
    oldPrice: 99.0,
    newPrice: 79.0,
  },
  {
    imageFront: "https://images.unsplash.com/photo-1605733160314-4fc7dac4bb16?q=80&w=890&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    imageBack: "https://images.unsplash.com/photo-1605733160314-4fc7dac4bb16?q=80&w=890&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Boots",
    title: "Timberland Premium Waterproof Boots",
    rating: 5,
    oldPrice: 229.0,
    newPrice: 189.0,
  },
  {
    imageFront: "https://images.unsplash.com/photo-1728877055062-ddfa96a8fa25?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    imageBack: "https://images.unsplash.com/photo-1728877055062-ddfa96a8fa25?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Sandals",
    title: "Birkenstock Arizona Soft Footbed Sandals",
    rating: 4,
    oldPrice: 139.0,
    newPrice: 109.0,
  },
  {
    imageFront: "https://images.unsplash.com/photo-1684478127000-3e8eeff77ccc?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    imageBack: "https://images.unsplash.com/photo-1684478127000-3e8eeff77ccc?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Heels",
    title: "Steve Madden Carrson Block Heel Sandals",
    rating: 5,
    oldPrice: 129.0,
    newPrice: 99.0,
  },
];


  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 border-b border-gray-100 pb-6">
          <div className="text-center lg:text-left mb-6 lg:mb-0">
            <h2 className="text-3xl font-light text-gray-900 tracking-tight mb-2">
              Trending Electronics
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
                        
          640: { slidesPerView: 2, spaceBetween: 20 },
              768: { slidesPerView: 3, spaceBetween: 24 },
              1024: { slidesPerView: 4, spaceBetween: 24 }, // max 4 slides
              1280: { slidesPerView: 4, spaceBetween: 24 },
            }}
            className="!pb-12"
          >
            {products.map((product, index) => (
              <SwiperSlide key={index} className="!h-auto">
                <div className="h-full px-2 py-4">
                  <Footwareitem {...product} />
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

export default Footwareslider;
