import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

import { Pagination, Autoplay } from 'swiper/modules';

const SLIDES = [
  { id: 1, img: "https://cdn.prod.website-files.com/6703454e01ce720b1ed10371/686c85deb86a2699c2979b45_What%20Is%20an%20E-commerce%20Packer%20-%20Main-min.jpg" },
  { id: 2, img: "https://www.portronics.com/cdn/shop/files/lithius_cell_web_banner.png?v=1764135133" },
  { id: 3, img: "https://www.portronics.com/cdn/shop/files/Pico_14.png?v=1758691178" },
  { id: 4, img: "https://www.portronics.com/cdn/shop/files/Zeno_Go_Banner_Web_5ce0b9bd-c2d0-4457-bcbf-228420d51667.png?v=1758530484" },
  { id: 5, img: "https://www.portronics.com/cdn/shop/files/ToadPlay_Banner_Web.png?v=1755768577" },
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
      {SLIDES.map((slide) => (
        <SwiperSlide key={slide.id}>
          <div className="w-full h-[200px] sm:h-[260px] md:h-[320px] overflow-hidden">
            <img
              src={slide.img}
              alt="slider"
              className="w-full h-full object-cover"
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HomeSlider;
