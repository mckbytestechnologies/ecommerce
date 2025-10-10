import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Groceriesitem from "../Groceriesitem";

const Groceriesslider = ({ items = 5 }) => {
  const products = [
  {
    // Fresh Produce
    imageFront: "https://plus.unsplash.com/premium_photo-1724249990805-479a50b00f2a?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    imageBack: "https://plus.unsplash.com/premium_photo-1724249990805-479a50b00f2a?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Produce",
    title: "Organic Fuji Apples (3lb Bag)",
    rating: 5,
    oldPrice: 8.99,
    newPrice: 6.99,
  },
  {
    // Dairy & Eggs
    imageFront: "https://plus.unsplash.com/premium_photo-1664647903833-318dce8f3239?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    imageBack: "https://plus.unsplash.com/premium_photo-1664647903833-318dce8f3239?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Dairy",
    title: "Artisan Aged Cheddar Cheese (8oz)",
    rating: 4,
    oldPrice: 12.50,
    newPrice: 9.99,
  },
  {
    // Beverages
    imageFront: "https://images.unsplash.com/photo-1625865019554-220ea80ea813?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    imageBack: "https://images.unsplash.com/photo-1625865019554-220ea80ea813?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Beverages",
    title: "Premium Arabica Whole Coffee Beans (12oz)",
    rating: 5,
    oldPrice: 18.99,
    newPrice: 15.99,
  },
  {
    // Pantry & Grains
    imageFront: "https://plus.unsplash.com/premium_photo-1664007755672-52d27e1766da?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    imageBack: "https://plus.unsplash.com/premium_photo-1664007755672-52d27e1766da?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Pantry",
    title: "Organic White Quinoa (1lb Box)",
    rating: 4,
    oldPrice: 7.00,
    newPrice: 5.50,
  },
  {
    // Meat & Seafood
    imageFront: "https://images.unsplash.com/photo-1559742811-822873691df8?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    imageBack: "https://images.unsplash.com/photo-1559742811-822873691df8?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Seafood",
    title: "Wild Alaskan Salmon Fillets (Frozen, 10oz)",
    rating: 5,
    oldPrice: 19.99,
    newPrice: 17.99,
  },
  {
    // Frozen Foods
    imageFront: "https://i.pinimg.com/736x/32/46/28/324628541368182d0d400b42d17071f3.jpg",
    imageBack: "https://i.pinimg.com/736x/32/46/28/324628541368182d0d400b42d17071f3.jpg",
    category: "Frozen",
    title: "Mixed Organic Berry Blend (16oz Bag)",
    rating: 4,
    oldPrice: 6.99,
    newPrice: 5.99,
  },
  {
    // Snacks
    imageFront: "https://i.pinimg.com/736x/b8/e1/0b/b8e10be36c13c5c535a119451ef5ccb0.jpg",
    imageBack: "https://i.pinimg.com/736x/b8/e1/0b/b8e10be36c13c5c535a119451ef5ccb0.jpg",
    category: "Snacks",
    title: "Gourmet Sea Salt Dark Chocolate Bar",
    rating: 5,
    oldPrice: 4.50,
    newPrice: 3.99,
  },
];



  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 border-b border-gray-100 pb-6">
          <div className="text-center lg:text-left mb-6 lg:mb-0">
            <h2 className="text-3xl font-light text-gray-900 tracking-tight mb-2">
              Trending Groceries
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
                  <Groceriesitem {...product} />
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

export default Groceriesslider;
