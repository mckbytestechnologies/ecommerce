import React from 'react';
import HomeSlider from '../../components/HomeSlider';
import HomeCatSlider from '../../components/HomeCatSlider';

import AdsBannerSlider from '../../components/AdsBannerSlider';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import ProductSlider from '../../components/ProductSlider';
import LatestProductSlider from '../../components/LatestProductSlider';
import { FaShippingFast, FaTags } from "react-icons/fa";
import Footer from '../../components/Footer';
import HomeSliderv2 from '../../components/HomeSliderv2';
import BannerBoxv2 from '../../components/BannerBoxv2';


const Home = () => {

 const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <HomeSlider />
      
      <HomeCatSlider />
      <br/>

      <sesction className='py-6'>
        
        <div  className=" containes flex items-center gap-5">
          <div className='part1 w-[70%]'>
             <HomeSliderv2 />
          </div>

          <div className=' pl-5 part2 w-[30%] flex items-center justify-between flex-col '>
             <BannerBoxv2 />
      
          </div>

        </div>

      </sesction>
    



<br/>
      <session className="bg-white py-8">
        <div className="containers">
          <div className="flex items-center justify-between">
            <div className='leftsec'>
              <h3 className='text-[25px] font-[600]'>
                Popular Product
              </h3>
              <p>Don Not Miss The Current Offers Until The End Of Sale </p>
            </div>

            <div className='rightsec w-[65%]'>
               <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="scrollable auto tabs example"
              >
                <Tab label="Fashion" />
                <Tab label="Electronics" />
                <Tab label="Bags" />
                <Tab label="Footware" />
                <Tab label="Groceries" />
                <Tab label="Beauty" />
                <Tab label="Jewellery" />
                <Tab label="Furniture" />
                <Tab label="Home Appliences" />
                <Tab label="Item Five" />
                <Tab label="Item Six" />
                <Tab label="Item Seven" />
              </Tabs>

            </div>
          </div>

          <ProductSlider items={5} />
        </div>
      </session>


<br/>

      <section className="w-full py-6 px-4">
      <div className="bg-gradient-to-r from-[#005c97] to-[#363795] 
                      rounded-2xl flex flex-col md:flex-row items-center 
                      justify-center gap-4 md:gap-8 px-6 py-6 shadow-lg">
        
        {/* Left Truck Icon */}
        <div className="flex items-center gap-3">
          <div className="bg-red-500 p-3 rounded-full">
            <FaShippingFast className="text-white text-4xl" />
          </div>
          <span className="text-white font-bold text-xl">FREE DELIVERY</span>
        </div>

        {/* Center Text */}
        <div className="text-center md:text-left flex-1">
          <p className="text-yellow-300 font-bold text-lg">
            Don’t Wait, Order Today
          </p>
          <p className="text-white font-semibold text-xl md:text-2xl">
            Get your new iPhone delivered within 3 days
          </p>
        </div>

        {/* Small T&C */}
        <div className="text-white/70 text-xs italic md:self-end">
          *T&C Apply
        </div>
      </div>
    </section>

    <br/>

   <AdsBannerSlider items={4} />

<br/>

<session className="bg-white py-8 mt-8">
        <div className="containers">
          <div className="flex items-center justify-between">
            <div className='leftsec'>
              <h3 className='text-[25px] font-[600]'>
                Latest Product
              </h3>
            </div>
          </div>

          <LatestProductSlider items={5} />
        </div>
      </session>

      <br/>
      <AdsBannerSlider items={3} />
      <br/>

      <section className="w-full py-6 px-4">
  <div className="bg-gradient-to-r from-[#FF512F] to-[#DD2476] 
                  rounded-2xl flex flex-col md:flex-row items-center 
                  justify-center gap-4 md:gap-8 px-6 py-6 shadow-lg">
    
    {/* Left Icon */}
    <div className="flex items-center gap-3">
      <div className="bg-yellow-400 p-3 rounded-full">
        <FaTags className="text-white text-4xl" />
      </div>
      <span className="text-white font-bold text-xl">BIG DISCOUNT</span>
    </div>

    {/* Center Text */}
    <div className="text-center md:text-left flex-1">
      <p className="text-yellow-200 font-bold text-lg">
        Limited Time Offer
      </p>
      <p className="text-white font-semibold text-xl md:text-2xl">
        Get up to 50% OFF on Fashion & Electronics
      </p>
    </div>

    {/* Small T&C */}
    <div className="text-white/70 text-xs italic md:self-end">
      *Valid till stock lasts
    </div>
  </div>
</section>

<br/>
      <AdsBannerSlider items={2} />

      <br/>
      <br/>

      

    </>
  );
};

export default Home;
