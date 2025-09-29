import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay'; // optional styling

import { Pagination, Autoplay } from 'swiper/modules';

const HomeSlider = () => {
  return (
    <Swiper
      pagination={{ dynamicBullets: true }}
      modules={[Pagination, Autoplay]}
      autoplay={{
        delay: 3000, // 3 seconds
        disableOnInteraction: false, // keeps autoplay after user interaction
      }}
      loop={true} // infinite loop
      className="mySwiper w-full"
    >
      <SwiperSlide>
        <div className="w-full h-[400px] md:h-[500px] relative overflow-hidden rounded-lg shadow-lg">
          <img
            src="/sliders/slider-1.jpg"
            alt="slider-image-1"
            className="w-full h-full object-cover"
          />
        </div>
      </SwiperSlide>

      <SwiperSlide>
        <div className="w-full h-[400px] md:h-[500px] relative overflow-hidden rounded-lg shadow-lg">
          <img
            src="/sliders/slider-2.jpg"
            alt="slider-image-2"
            className="w-full h-full object-cover"
          />
        </div>
      </SwiperSlide>

      <SwiperSlide>
        <div className="w-full h-[400px] md:h-[500px] relative overflow-hidden rounded-lg shadow-lg">
          <img
            src="/sliders/slider-3.jpg"
            alt="slider-image-3"
            className="w-full h-full object-cover"
          />
        </div>
      </SwiperSlide>

      <SwiperSlide>
        <div className="w-full h-[400px] md:h-[500px] relative overflow-hidden rounded-lg shadow-lg">
          <img
            src="/sliders/slider-4.jpg"
            alt="slider-image-4"
            className="w-full h-full object-cover"
          />
        </div>
      </SwiperSlide>

      <SwiperSlide>
        <div className="w-full h-[400px] md:h-[500px] relative overflow-hidden rounded-lg shadow-lg">
          <img
            src="/sliders/sliders-5.jpg"
            alt="slider-image-5"
            className="w-full h-full object-cover"
          />
        </div>
      </SwiperSlide>
    </Swiper>
  );
};

export default HomeSlider;
