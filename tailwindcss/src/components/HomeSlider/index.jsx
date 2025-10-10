import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

import { Pagination, Autoplay } from 'swiper/modules';

const SLIDES = [
  {
    id: 1,
    title: "Summer Fashion Sale",
    subtitle: "Up to 50% Off",
    price: "Starting at ₹999",
    img: "https://plus.unsplash.com/premium_photo-1664202526559-e21e9c0fb46a?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    cta: "Shop Now",
  },
  {
    id: 2,
    title: "Smartphones Mega Deal",
    subtitle: "Latest Tech at Best Prices",
    price: "From ₹15,999",
    img: "https://images.pexels.com/photos/269252/pexels-photo-269252.jpeg",
    cta: "Buy Now",
  },
  {
    id: 3,
    title: "Home Appliances Offer",
    subtitle: "Upgrade Your Home",
    price: "Discounts up to 40%",
    img: "https://plus.unsplash.com/premium_photo-1661319053237-28574051d1c3?q=80&w=894&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    cta: "Grab Deal",
  },
  {
    id: 4,
    title: "Fashion Accessories",
    subtitle: "Trendy & Affordable",
    price: "Starting at ₹299",
    img: "https://images.pexels.com/photos/8939806/pexels-photo-8939806.jpeg",
    cta: "Explore Now",
  },
  {
    id: 5,
    title: "Electronics Sale",
    subtitle: "Best Deals of the Month",
    price: "Up to 60% Off",
    img: "https://images.pexels.com/photos/705164/computer-laptop-work-place-camera-705164.jpeg",
    
  },
];

const HomeSlider = () => {
  return (
    <Swiper
      pagination={{ dynamicBullets: true }}
      modules={[Pagination, Autoplay]}
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      loop={true}
      className="mySwiper w-full"
    >
      {SLIDES.map(slide => (
        <SwiperSlide key={slide.id}>
          <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] overflow-hidden rounded-lg shadow-lg">
            <img
              src={slide.img}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-start p-8 md:p-12">
              <span className="text-red-300 text-lg md:text-xl">{slide.subtitle}</span>
              <h2 className="text-white font-extrabold text-2xl md:text-4xl mt-2">{slide.title}</h2>
              <p className="text-yellow-400 text-lg md:text-2xl mt-1">{slide.price}</p>
              <button className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full text-sm md:text-base">
                {slide.cta}
              </button>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HomeSlider;
