import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import ElectronicsItem from "../ElectronicsItem";

const ElectronicsSlider = ({ items = 5 }) => {
  const products = [
    {
      imageFront: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      imageBack: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: "Laptops",
      title: "Apple MacBook Pro M3 16” (2024)",
      rating: 5,
      oldPrice: 2499.0,
      newPrice: 2199.0,
    },
    {
      imageFront: "https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg",
      imageBack: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg",
      category: "Headphones",
      title: "Sony WH-1000XM5 Noise Cancelling Headphones",
      rating: 5,
      oldPrice: 499.0,
      newPrice: 429.0,
    },
    {
      imageFront: "https://images.pexels.com/photos/30466739/pexels-photo-30466739.jpeg",
      imageBack: "https://images.pexels.com/photos/30466739/pexels-photo-30466739.jpeg",
      category: "Smartphones",
      title: "Samsung Galaxy S24 Ultra 5G",
      rating: 4,
      oldPrice: 1299.0,
      newPrice: 1149.0,
    },
    {
      imageFront: "https://images.pexels.com/photos/270288/pexels-photo-270288.jpeg",
      imageBack: "https://images.pexels.com/photos/270288/pexels-photo-270288.jpeg",
      category: "Drones",
      title: "DJI Mini 4 Pro – 4K Lightweight Drone",
      rating: 5,
      oldPrice: 999.0,
      newPrice: 849.0,
    },
    {
      imageFront: "https://images.pexels.com/photos/13007642/pexels-photo-13007642.jpeg",
      imageBack: "https://images.pexels.com/photos/13007642/pexels-photo-13007642.jpeg",
      category: "Smart Watches",
      title: "Apple Watch Ultra 2 Titanium Case",
      rating: 4,
      oldPrice: 899.0,
      newPrice: 799.0,
    },
    {
      imageFront: "https://images.pexels.com/photos/1827054/pexels-photo-1827054.jpeg",      
      imageBack: "https://images.pexels.com/photos/1827054/pexels-photo-1827054.jpeg",
      category: "Smart TVs",
      title: "Samsung Neo QLED 8K 65” Smart TV",
      rating: 5,
      oldPrice: 3499.0,
      newPrice: 2999.0,
    },
    {
      imageFront: "https://images.unsplash.com/photo-1592840496694-26d035b52b48?q=80&w=525&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      imageBack: "https://images.unsplash.com/photo-1592840496694-26d035b52b48?q=80&w=525&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: "Consoles",
      title: "PlayStation 5 Digital Edition",
      rating: 5,
      oldPrice: 599.0,
      newPrice: 549.0,
    },
  ];

  return (
    <div className="bg-white py-16">
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
                  <ElectronicsItem {...product} />
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

export default ElectronicsSlider;
