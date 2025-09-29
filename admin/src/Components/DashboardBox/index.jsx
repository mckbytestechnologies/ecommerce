import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

// import required modules
import { Navigation } from 'swiper/modules';

import { BsGiftFill } from "react-icons/bs";
import { IoStatsChartSharp, IoPieChartSharp } from "react-icons/io5";
import { BsBank } from "react-icons/bs";
import { MdProductionQuantityLimits } from "react-icons/md";

const DashboardBox = () => {
  return (
    <>
      <Swiper
        // RESPONSIVE SETTINGS
        breakpoints={{
          320: { slidesPerView: 1, spaceBetween: 12 },   // Mobile
          640: { slidesPerView: 2, spaceBetween: 14 },   // Small tablets
          1024: { slidesPerView: 3, spaceBetween: 16 },  // Tablets
          1280: { slidesPerView: 4, spaceBetween: 18 },  // Desktop
        }}
        navigation={true}
        modules={[Navigation]}
        className="dashboardBoxSlider"
      >
        {/* CARD 1 */}
        <SwiperSlide>
          <div className="stats-card p-4 cursor-pointer transition-all duration-300 ease-in-out rounded-lg border border-gray-200 hover:shadow-md hover:bg-gray-50 flex items-center justify-between gap-4">
            <div className="content-group flex items-center gap-4">
              <div className="icon-circle p-3 rounded-full bg-green-50">
                <BsGiftFill size={22} className="text-[#10b981]" />
              </div>
              <div className="info">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  New Orders
                </p>
                <h3 className="text-xl md:text-2xl font-bold text-gray-800">
                  1,399
                </h3>
              </div>
            </div>
            <IoStatsChartSharp className="text-2xl md:text-3xl text-[#10b981] opacity-80" />
          </div>
        </SwiperSlide>

        {/* CARD 2 */}
        <SwiperSlide>
          <div className="stats-card p-4 cursor-pointer transition-all duration-300 ease-in-out rounded-lg border border-gray-200 hover:shadow-md hover:bg-gray-50 flex items-center justify-between gap-4">
            <div className="content-group flex items-center gap-4">
              <div className="icon-circle p-3 rounded-full bg-blue-50">
                <IoPieChartSharp size={22} className="text-blue-500" />
              </div>
              <div className="info">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Sales
                </p>
                <h3 className="text-xl md:text-2xl font-bold text-gray-800">
                  ₹57,890
                </h3>
              </div>
            </div>
            <IoStatsChartSharp className="text-2xl md:text-3xl text-blue-500 opacity-80" />
          </div>
        </SwiperSlide>

        {/* CARD 3 */}
        <SwiperSlide>
          <div className="stats-card p-4 cursor-pointer transition-all duration-300 ease-in-out rounded-lg border border-gray-200 hover:shadow-md hover:bg-gray-50 flex items-center justify-between gap-4">
            <div className="content-group flex items-center gap-4">
              <div className="icon-circle p-3 rounded-full bg-purple-50">
                <BsBank size={22} className="text-[#7928ca]" />
              </div>
              <div className="info">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </p>
                <h3 className="text-xl md:text-2xl font-bold text-gray-800">
                  1,399
                </h3>
              </div>
            </div>
            <IoStatsChartSharp className="text-2xl md:text-3xl text-[#7928ca] opacity-80" />
          </div>
        </SwiperSlide>

        {/* CARD 4 */}
        <SwiperSlide>
          <div className="stats-card p-4 cursor-pointer transition-all duration-300 ease-in-out rounded-lg border border-gray-200 hover:shadow-md hover:bg-gray-50 flex items-center justify-between gap-4">
            <div className="content-group flex items-center gap-4">
              <div className="icon-circle p-3 rounded-full bg-indigo-50">
                <MdProductionQuantityLimits size={22} className="text-[#312be1da]" />
              </div>
              <div className="info">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Products
                </p>
                <h3 className="text-xl md:text-2xl font-bold text-gray-800">
                  1,00,000+
                </h3>
              </div>
            </div>
            <IoStatsChartSharp className="text-2xl md:text-3xl text-[#312be1da] opacity-80" />
          </div>
        </SwiperSlide>
      </Swiper>
    </>
  )
}

export default DashboardBox
