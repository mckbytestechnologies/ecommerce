import React from 'react'

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';



// import required modules
import { EffectFade, Navigation, Pagination } from 'swiper/modules';

import Button from '@mui/material/Button';
import { motion } from "framer-motion";


const HomeSliderv2 =() => {
    return (
    <>
      <Swiper
        loop={true}
        spaceBetween={30}
        effect={'fade'}
        navigation={true}
        pagination={{
          clickable: true,
        }}
        modules={[EffectFade, Navigation, Pagination]}
        className="mySwiper"
      >
        <SwiperSlide>
          <div className='item-full rounded-md overflow-hidden relative'>
            <img src="https://serviceapi.spicezgold.com/download/1756273096312_1737036773579_sample-1.jpg" />

            <div className='info absolute top-0 right-0 w-[50%] h-[100%] z-50 p-8 flex items-center flex-col justify-center mb-5'>
                <h4 className='text-[20px] font-[500] text-left w-full'>Big Savings Day Sale</h4>
                <h2 className='text-[40px] font-[600] w-full'> Women Solid Round Green T-Shirt</h2>
                <h3 className='flex items-center gap-3 text-[20px] font-[500] text-left w-full'>
                    Starting At Only 
                    <span className='text-red-800 text-[30px]'>₹1199.00</span>
                </h3>

              <div className="w-full">
                <Button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300">
                    Shop Now
                </Button>
            </div>


            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className='item-full rounded-md overflow-hidden relative'>
            <img src="https://serviceapi.spicezgold.com/download/1742441193376_1737037654953_New_Project_45.jpg" />

            <div className='info absolute top-0 right-0 w-[50%] h-[100%] z-50 p-8 flex items-center flex-col justify-center mb-5'>
                <h4 className='text-[20px] font-[500] text-left w-full'>Big Savings Day Sale</h4>
                <h2 className='text-[40px] font-[600] w-full'>Apple iPhone 13 128 Pink</h2>
                <h3 className='flex items-center gap-3 text-[20px] font-[500] text-left w-full'>
                    Starting At Only 
                    <span className='text-red-800 text-[30px]'>₹35,500.00</span>
                </h3>

              <div className="w-full">
                <Button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300">
                    Shop Now
                </Button>
            </div>


            </div>
          </div>
        </SwiperSlide>
        

       
      </Swiper>
    </>
  );
}

export default HomeSliderv2;

