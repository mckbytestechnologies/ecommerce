import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';

import { Navigation } from "swiper/modules";

const HomeCatSlider = () => {
  return (
    <div className="homeCatSlider mt-10">
      <div className="containers">
        <Swiper
          spaceBetween={15}
          modules={[Navigation]}
          className="mySwiper"
          grabCursor={false} // disables grab cursor
          breakpoints={{
            0: {
              slidesPerView: 2, // very small devices
            },
            480: {
              slidesPerView: 3, // small phones
            },
            640: {
              slidesPerView: 4, // larger phones
            },
            768: {
              slidesPerView: 5, // tablets
            },
            1024: {
              slidesPerView: 6, // small desktops
            },
            1280: {
              slidesPerView: 7, // large desktops
            },
          }}
        >
          {/* Mobiles */}
          <SwiperSlide>
            <div className="relative group w-full h-40 rounded-lg overflow-hidden shadow-md">
              <img
                src="/homecat/phone.jpg"
                alt="Mobiles"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <h3 className="absolute bottom-2 left-2 text-white text-sm md:text-base font-semibold tracking-wide">
                Mobiles
              </h3>
            </div>
          </SwiperSlide>

          {/* Laptops */}
          <SwiperSlide>
            <div className="relative group w-full h-40 rounded-lg overflow-hidden shadow-md">
              <img
                src="/homecat/laptop.jpg"
                alt="Laptops"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <h3 className="absolute bottom-2 left-2 text-white text-sm md:text-base font-semibold tracking-wide">
                Laptops
              </h3>
            </div>
          </SwiperSlide>

          {/* Mens Fashion */}
          <SwiperSlide>
            <div className="relative group w-full h-40 rounded-lg overflow-hidden shadow-md">
              <img
                src="/homecat/men.jpg"
                alt="Mens Fashion"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <h3 className="absolute bottom-2 left-2 text-white text-sm md:text-base font-semibold tracking-wide">
                Fashion (Mens)
              </h3>
            </div>
          </SwiperSlide>

          {/* Womens Fashion */}
          <SwiperSlide>
            <div className="relative group w-full h-40 rounded-lg overflow-hidden shadow-md">
              <img
                src="/homecat/women.jpg"
                alt="Womens Fashion"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <h3 className="absolute bottom-2 left-2 text-white text-sm md:text-base font-semibold tracking-wide">
                Fashion (Womens)
              </h3>
            </div>
          </SwiperSlide>

          {/* Kids */}
          <SwiperSlide>
            <div className="relative group w-full h-40 rounded-lg overflow-hidden shadow-md">
              <img
                src="/homecat/kids.jpg"
                alt="Kids Fashion"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <h3 className="absolute bottom-2 left-2 text-white text-sm md:text-base font-semibold tracking-wide">
                Fashion (Kids)
              </h3>
            </div>
          </SwiperSlide>

          {/* Footwear */}
          <SwiperSlide>
            <div className="relative group w-full h-40 rounded-lg overflow-hidden shadow-md">
              <img
                src="/homecat/shoe.jpg"
                alt="Footwear"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <h3 className="absolute bottom-2 left-2 text-white text-sm md:text-base font-semibold tracking-wide">
                Footwear
              </h3>
            </div>
          </SwiperSlide>

          <SwiperSlide>
                        <div className="relative group w-full h-40 rounded-lg overflow-hidden shadow-md">
                        
                            <img
                            src="/homecat/beauty.jpg"
                            alt="Mobiles"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                            <h3 className="absolute bottom-2 left-2 text-white text-base font-semibold tracking-wide group-hover:text-black-300 transition">
                            Beauty
                            </h3>
                        </div>
                    </SwiperSlide>

                    <SwiperSlide>
                        <div className="relative group w-full h-40 rounded-lg overflow-hidden shadow-md">
                        
                            <img
                            src="/homecat/furniteris.jpg"
                            alt="Mobiles"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                            <h3 className="absolute bottom-2 left-2 text-white text-base font-semibold tracking-wide group-hover:text-black-300 transition">
                            Furniture
                            </h3>
                        </div>
                    </SwiperSlide>

                    <SwiperSlide>
                        <div className="relative group w-full h-40 rounded-lg overflow-hidden shadow-md">
                        
                            <img
                            src="/homecat/dining.jpg"
                            alt="Mobiles"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                            <h3 className="absolute bottom-2 left-2 text-white text-base font-semibold tracking-wide group-hover:text-black-300 transition">
                            Kitchen & Dining
                            </h3>
                        </div>
                    </SwiperSlide>

                    <SwiperSlide>
                        <div className="relative group w-full h-40 rounded-lg overflow-hidden shadow-md">
                        
                            <img
                            src="/homecat/Appliances (TV, Refrigerator, AC, Washing Machine).jpg"
                            alt="Mobiles"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                            <h3 className="absolute bottom-2 left-2 text-white text-base font-semibold tracking-wide group-hover:text-black-300 transition">
                            Appliances
                            </h3>
                        </div>
                    </SwiperSlide>

                    <SwiperSlide>
                        <div className="relative group w-full h-40 rounded-lg overflow-hidden shadow-md">
                        
                            <img
                            src="/homecat/Sports & Fitness.jpg"
                            alt="Mobiles"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                            <h3 className="absolute bottom-2 left-2 text-white text-base font-semibold tracking-wide group-hover:text-black-300 transition">
                            Sports
                            </h3>
                        </div>
                    </SwiperSlide>

                    <SwiperSlide>
                        <div className="relative group w-full h-40 rounded-lg overflow-hidden shadow-md">
                        
                            <img
                            src="/homecat/Books & Stationery.jpg"
                            alt="Mobiles"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                            <h3 className="absolute bottom-2 left-2 text-white text-base font-semibold tracking-wide group-hover:text-black-300 transition">
                            Books & Stationery
                            </h3>
                        </div>
                    </SwiperSlide>

                    <SwiperSlide>
                        <div className="relative group w-full h-40 rounded-lg overflow-hidden shadow-md">
                        
                            <img
                            src="/homecat/toy.jpg"
                            alt="Mobiles"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                            <h3 className="absolute bottom-2 left-2 text-white text-base font-semibold tracking-wide group-hover:text-black-300 transition">
                            Toys & Baby Products
                            </h3>
                        </div>
                    </SwiperSlide>

                    <SwiperSlide>
                        <div className="relative group w-full h-40 rounded-lg overflow-hidden shadow-md">
                        
                            <img
                            src="/homecat/watch.jpg"
                            alt="Mobiles"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                            <h3 className="absolute bottom-2 left-2 text-white text-base font-semibold tracking-wide group-hover:text-black-300 transition">
                            Watches
                            </h3>
                        </div>
                    </SwiperSlide>

                     <SwiperSlide>
                        <div className="relative group w-full h-40 rounded-lg overflow-hidden shadow-md">
                        
                            <img
                            src="/homecat/jellwary.jpg"
                            alt="Mobiles"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                            <h3 className="absolute bottom-2 left-2 text-white text-base font-semibold tracking-wide group-hover:text-black-300 transition">
                            Jewelry
                            </h3>
                        </div>
                    </SwiperSlide>


          {/* Add your other categories (Beauty, Furniture, Appliances, etc.) in the same pattern */}
        </Swiper>
      </div>
    </div>
  );
};

export default HomeCatSlider;
