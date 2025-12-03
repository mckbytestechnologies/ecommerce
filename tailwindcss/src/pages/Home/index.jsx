import React from 'react';
import HomeSlider from '../../components/HomeSlider';
import HomeCatSlider from '../../components/HomeCatSlider';
import AdsBannerSlider from '../../components/AdsBannerSlider';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import ProductSlider from '../../components/ProductSlider';
import LatestProductSlider from '../../components/LatestProductSlider';
import { FaShippingFast, FaTags } from "react-icons/fa";
import Footer from '../../components/Footer';
import HomeSliderv2 from '../../components/HomeSliderv2';
import ElectronicsSlider from '../../components/ElectronicsSlider';
import Furnitureslider from '../../components/Furnitureslider';
import Jewelleryslider from '../../components/Jewelleryslider';
import Groceriesslider from '../../components/Groceriesslider';
import Bagsslider from '../../components/Bagsslider';
import Footwareslider from '../../components/Footwareslider';
import Beautyslider from '../../components/Beautyslider';

// 👉 You can import more category sliders if you have them
// import FashionSlider from '../../components/FashionSlider';
// import FurnitureSlider from '../../components/FurnitureSlider';

const Home = () => {

  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      {/* Hero Section */}
      <HomeSlider />
      <HomeCatSlider />
      <br />

      {/* Secondary Banner */}
      {/* <section className='py-6'>
        <div className="containers flex items-center gap-5">
          <div className='part1 w-[100%]'>
            <HomeSliderv2 />
          </div>
        </div>
      </section> */}
      <br />
      <AdsBannerSlider items={3} />

      <br />

      {/* Popular Product Section with Tabs */}
      <section className="bg-white py-8">
        <div className="containers">
          <div className="flex items-center justify-between mb-4">
            <div className='leftsec'>
              <h3 className='text-[25px] font-[600]'>Popular Product</h3>
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
                <Tab label="Footwear" />
                <Tab label="Groceries" />
                <Tab label="Beauty" />
                <Tab label="Jewellery" />
                <Tab label="Furniture" />
              </Tabs>
            </div>
          </div>

          {/* ✅ Conditionally show sliders based on selected tab */}
          {value === 0 && <ProductSlider items={5} />}          {/* Fashion */}
          {value === 1 && <ElectronicsSlider items={5} />}       {/* Electronics */}
          {value === 2 && <Bagsslider items={5} category="bags" />}
          {value === 3 && <Footwareslider items={5} category="footwear" />}
          {value === 4 && <Groceriesslider items={5} category="groceries" />}
          {value === 5 && <Beautyslider items={5} category="beauty" />}
          {value === 6 && <Jewelleryslider items={5} category="jewellery" />}
          {value === 7 && <Furnitureslider items={5} category="furniture" />}
        </div>
      </section>

      {/* Offer Banner 1 */}
      <section className="w-full py-6 px-4">
        <div className="bg-gradient-to-r from-[#005c97] to-[#363795] 
                        rounded-2xl flex flex-col md:flex-row items-center 
                        justify-center gap-4 md:gap-8 px-6 py-6 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="bg-red-500 p-3 rounded-full">
              <FaShippingFast className="text-white text-4xl" />
            </div>
            <span className="text-white font-bold text-xl">FREE DELIVERY</span>
          </div>

          <div className="text-center md:text-left flex-1">
            <p className="text-yellow-300 font-bold text-lg">
              Don’t Wait, Order Today
            </p>
            <p className="text-white font-semibold text-xl md:text-2xl">
              Get your new iPhone delivered within 3 days
            </p>
          </div>

          <div className="text-white/70 text-xs italic md:self-end">
            *T&C Apply
          </div>
        </div>
      </section>

      <br />
      <AdsBannerSlider items={4} />
      <br />

      {/* Latest Product Section */}
      <section className="bg-white  mt-8 relative z-[1]">
        <div className="containers">
          <div className="flex items-center justify-between mb-4">
            <div className='leftsec'>
              <h3 className='text-[25px] font-[600]'>Latest Product</h3>
            </div>
          </div>
          <LatestProductSlider items={5} />
        </div>
      </section>

      <section className="bg-white  mt-8 relative z-[1]">
        <div className="containers">
          <div className="flex items-center justify-between mb-4">
          </div>
          <ElectronicsSlider items={5} />
        </div>
      </section>

      <section className="bg-white  mt-8 relative z-[1]">
        <div className="containers">
          <div className="flex items-center justify-between mb-4">
          </div>
          <Furnitureslider items={5} />
        </div>
      </section>

      <section className="bg-white  mt-8 relative z-[1]">
        <div className="containers">
          <div className="flex items-center justify-between mb-4">
          </div>
          <Jewelleryslider items={5} />
        </div>
      </section>

      <section className="bg-white  mt-8 relative z-[1]">
        <div className="containers">
          <div className="flex items-center justify-between mb-4">
          </div>
          <Groceriesslider items={5} />
        </div>
      </section>

      <section className="bg-white  mt-8 relative z-[1]">
        <div className="containers">
          <div className="flex items-center justify-between mb-4">
          </div>
          <Bagsslider items={5} />
        </div>
      </section>

      <section className="bg-white  mt-8 relative z-[1]">
        <div className="containers">
          <div className="flex items-center justify-between mb-4">
          </div>
          <Footwareslider items={5} />
        </div>
      </section>

      <section className="bg-white  mt-8 relative z-[1]">
        <div className="containers">
          <div className="flex items-center justify-between mb-4">
          </div>
          <Beautyslider items={5} />
        </div>
      </section>

      

      {/* Offer Banner 2 */}
      <section className="w-full py-6 px-4">
        <div className="bg-gradient-to-r from-[#FF512F] to-[#DD2476] 
                        rounded-2xl flex flex-col md:flex-row items-center 
                        justify-center gap-4 md:gap-8 px-6 py-6 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-400 p-3 rounded-full">
              <FaTags className="text-white text-4xl" />
            </div>
            <span className="text-white font-bold text-xl">BIG DISCOUNT</span>
          </div>

          <div className="text-center md:text-left flex-1">
            <p className="text-yellow-200 font-bold text-lg">Limited Time Offer</p>
            <p className="text-white font-semibold text-xl md:text-2xl">
              Get up to 50% OFF on Fashion & Electronics
            </p>
          </div>

          <div className="text-white/70 text-xs italic md:self-end">
            *Valid till stock lasts
          </div>
        </div>
      </section>

      <br />
      <AdsBannerSlider items={2} />
      <br />
      <br />

      
    </>
  );
};

export default Home;
