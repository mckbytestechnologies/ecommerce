import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';

import { Navigation } from "swiper/modules";
const HomeCatSlider = () => {
return (
    <div className="homeCatSlider mt-20">

       <div className="containers">

                <Swiper
                    slidesPerView={7}
                    spaceBetween={30}
                    modules={[Navigation]}
                    className="mySwiper"
                >
                   <SwiperSlide>
                        <div className="relative group w-full h-40 rounded-lg overflow-hidden shadow-md">
                        
                            <img
                            src="/homecat/phone.jpg"
                            alt="Mobiles"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                            <h3 className="absolute bottom-2 left-2 text-white text-base font-semibold tracking-wide group-hover:text-black-300 transition">
                            Mobiles
                            </h3>
                        </div>
                    </SwiperSlide>

                    <SwiperSlide>
                        <div className="relative group w-full h-40 rounded-lg overflow-hidden shadow-md">
                        
                            <img
                            src="/homecat/laptop.jpg"
                            alt="Mobiles"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                            <h3 className="absolute bottom-2 left-2 text-white text-base font-semibold tracking-wide group-hover:text-black-300 transition">
                            Laptops
                            </h3>
                        </div>
                    </SwiperSlide>

                    <SwiperSlide>
                        <div className="relative group w-full h-40 rounded-lg overflow-hidden shadow-md">
                        
                            <img
                            src="/homecat/men.jpg"
                            alt="Mobiles"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                            <h3 className="absolute bottom-2 left-2 text-white text-base font-semibold tracking-wide group-hover:text-black-300 transition">
                            Fashion(Mens)
                            </h3>
                        </div>
                    </SwiperSlide>

                    <SwiperSlide>
                        <div className="relative group w-full h-40 rounded-lg overflow-hidden shadow-md">
                        
                            <img
                            src="/homecat/women.jpg"
                            alt="Mobiles"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                            <h3 className="absolute bottom-2 left-2 text-white text-base font-semibold tracking-wide group-hover:text-black-300 transition">
                            Fashion(Womens)
                            </h3>
                        </div>
                    </SwiperSlide>

                    <SwiperSlide>
                        <div className="relative group w-full h-40 rounded-lg overflow-hidden shadow-md">
                        
                            <img
                            src="/homecat/kids.jpg"
                            alt="Mobiles"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                            <h3 className="absolute bottom-2 left-2 text-white text-base font-semibold tracking-wide group-hover:text-black-300 transition">
                            Fashion(Kids)
                            </h3>
                        </div>
                    </SwiperSlide>

                    <SwiperSlide>
                        <div className="relative group w-full h-40 rounded-lg overflow-hidden shadow-md">
                        
                            <img
                            src="/homecat/shoe.jpg"
                            alt="Mobiles"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                            <h3 className="absolute bottom-2 left-2 text-white text-base font-semibold tracking-wide group-hover:text-black-300 transition">
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

                </Swiper>
       </div>
    </div>
);
}
export default HomeCatSlider;