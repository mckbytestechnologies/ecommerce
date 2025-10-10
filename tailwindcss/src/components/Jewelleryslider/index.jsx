import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Jewelleryitem from "../Jewelleryitem";

const Jewelleryslider = ({ items = 5 }) => {
  const products = [
  {
    // Diamond Rings
    imageFront: "https://images.unsplash.com/photo-1627293509201-cd0c780043e6?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    imageBack: "https://images.unsplash.com/photo-1627293509201-cd0c780043e6?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Rings",
    title: "1.5 Carat Solitaire Diamond Ring (Platinum)",
    rating: 5,
    oldPrice: 4500.0,
    newPrice: 3999.0,
  },
  {
    // Necklaces
    imageFront: "https://i.pinimg.com/1200x/f7/de/15/f7de153ff1f39f955631cf0bf359ea82.jpg",
    imageBack: "https://i.pinimg.com/1200x/f7/de/15/f7de153ff1f39f955631cf0bf359ea82.jpg",
    category: "Necklaces",
    title: "18k Gold Plated Infinity Pendant Necklace",
    rating: 4,
    oldPrice: 120.0,
    newPrice: 89.0,
  },
  {
    // Earrings
    imageFront: "https://images.unsplash.com/photo-1615655114865-4cc1bda5901e?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    imageBack: "https://images.unsplash.com/photo-1615655114865-4cc1bda5901e?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Earrings",
    title: "Classic Freshwater Pearl Drop Earrings (Silver)",
    rating: 5,
    oldPrice: 79.0,
    newPrice: 59.0,
  },
  {
    // Bracelets
    imageFront: "https://images.unsplash.com/photo-1740567389909-b36e9cadbef9?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    imageBack: "https://images.unsplash.com/photo-1740567389909-b36e9cadbef9?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Bracelets",
    title: "Rose Gold Plated Pave Link Bracelet",
    rating: 4,
    oldPrice: 199.0,
    newPrice: 149.0,
  },
  {
    // Pendants/Fine Jewelry
    imageFront: "https://images.unsplash.com/photo-1589128777073-263566ae5e4d?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    imageBack: "https://images.unsplash.com/photo-1589128777073-263566ae5e4d?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Pendants",
    title: "Genuine Emerald Cut Sapphire Pendant",
    rating: 5,
    oldPrice: 650.0,
    newPrice: 580.0,
  },
  {
    // Watches
    imageFront: "https://i.pinimg.com/1200x/f4/a2/e9/f4a2e93d3057cf3432d58f10e71c2da3.jpg",
    imageBack: "https://i.pinimg.com/1200x/f4/a2/e9/f4a2e93d3057cf3432d58f10e71c2da3.jpg",
    category: "Watches",
    title: "Classic Women's Leather Strap Watch",
    rating: 4,
    oldPrice: 350.0,
    newPrice: 299.0,
  },
  {
    // Jewelry Sets
    imageFront: "https://images.unsplash.com/photo-1588444968576-f8fe92ce56fd?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    imageBack: "https://images.unsplash.com/photo-1588444968576-f8fe92ce56fd?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Sets",
    title: "Sterling Silver Necklace and Earring Gift Set",
    rating: 5,
    oldPrice: 150.0,
    newPrice: 125.0,
  },
];


  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 border-b border-gray-100 pb-6">
          <div className="text-center lg:text-left mb-6 lg:mb-0">
            <h2 className="text-3xl font-light text-gray-900 tracking-tight mb-2">
              Trending Jewellery
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
                  <Jewelleryitem {...product} />
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

export default Jewelleryslider;
