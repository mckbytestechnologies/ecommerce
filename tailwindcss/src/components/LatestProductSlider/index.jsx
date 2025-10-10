import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import LatestProductItem from "../LatestProductItem";

const LatestProductSlider = ({ items = 5 }) => {
    const products = [
    {
      imageFront: "https://images.unsplash.com/photo-1661143971715-bc954b86344f?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      imageBack: "https://images.unsplash.com/photo-1661143971715-bc954b86344f?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: "I Phone",
      title: "MAYNOS Suction Phone Case Mount",
      rating: 4,
      oldPrice: 58.0,
      newPrice: 48.0,
    },
    {
      imageFront: "https://images.unsplash.com/photo-1677172479994-b61052d5d567?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      imageBack: "https://images.unsplash.com/photo-1677172479994-b61052d5d567?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: "Samsung",
      title: "Galaxy S22 Ultra Protective Case",
      rating: 5,
      oldPrice: 60.0,
      newPrice: 50.0,
    },
    {
      imageFront: "https://images.unsplash.com/photo-1621476737725-9530d664a0f4?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      imageBack: "https://images.unsplash.com/photo-1621476737725-9530d664a0f4?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: "Accessories",
      title: "Wireless Charging Pad Stand",
      rating: 3,
      oldPrice: 30.0,
      newPrice: 25.0,
    },
    {
      imageFront: "https://plus.unsplash.com/premium_photo-1679513691474-73102089c117?q=80&w=813&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      imageBack: "https://plus.unsplash.com/premium_photo-1679513691474-73102089c117?q=80&w=813&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: "Headphones",
      title: "Noise Cancelling Bluetooth Headphones",
      rating: 4,
      oldPrice: 80.0,
      newPrice: 70.0,
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
      imageFront: "https://images.unsplash.com/photo-1660844817855-3ecc7ef21f12?q=80&w=486&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      imageBack: "https://images.unsplash.com/photo-1660844817855-3ecc7ef21f12?q=80&w=486&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: "Smartwatch",
      title: "Fitness Tracker Smartwatch",
      rating: 4,
      oldPrice: 100.0,
      newPrice: 90.0,
    },
    {
      imageFront: "https://images.unsplash.com/photo-1621476737725-9530d664a0f4?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      imageBack: "https://images.unsplash.com/photo-1621476737725-9530d664a0f4?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: "Accessories",
      title: "Wireless Charging Pad Stand",
      rating: 3,
      oldPrice: 30.0,
      newPrice: 25.0,
    },
    {
      imageFront: "https://plus.unsplash.com/premium_photo-1679513691474-73102089c117?q=80&w=813&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      imageBack: "https://plus.unsplash.com/premium_photo-1679513691474-73102089c117?q=80&w=813&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: "Headphones",
      title: "Noise Cancelling Bluetooth Headphones",
      rating: 4,
      oldPrice: 80.0,
      newPrice: 70.0,
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
      imageFront: "https://images.unsplash.com/photo-1660844817855-3ecc7ef21f12?q=80&w=486&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      imageBack: "https://images.unsplash.com/photo-1660844817855-3ecc7ef21f12?q=80&w=486&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: "Smartwatch",
      title: "Fitness Tracker Smartwatch",
      rating: 4,
      oldPrice: 100.0,
      newPrice: 90.0,
    },
  ];

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 border-b border-gray-100 pb-6">
          <div className="text-center lg:text-left mb-6 lg:mb-0">
            <h2 className="text-3xl font-light text-gray-900 tracking-tight mb-2">
              Latest Products
            </h2>
            <p className="text-gray-500 font-light">
              Discover our newest arrivals and innovative technologies
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
              480: {
                slidesPerView: 2,
                spaceBetween: 20
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 24
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 24
              },
              1280: {
                slidesPerView: 5,
                spaceBetween: 24
              }
            }}
            className="!pb-12"
          >
            {products.map((product, index) => (
              <SwiperSlide key={index} className="!h-auto">
                <div className="h-full px-2 py-4">
                  <LatestProductItem {...product} />
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

export default LatestProductSlider;