import React, { useEffect, useState } from "react";
import axios from "axios";

import HomeSlider from "../../components/HomeSlider";
import HomeCatSlider from "../../components/HomeCatSlider";
import AdsBannerSlider from "../../components/AdsBannerSlider";
import LatestProductSlider from "../../components/LatestProductSlider";
import CategorySlider from "../../components/CategorySlider";
import Footer from "../../components/Footer";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import { FaShippingFast, FaTags } from "react-icons/fa";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);

  /* 🔥 FETCH CATEGORIES (DYNAMIC) */
  useEffect(() => {
    axios
      .get("https://ecommerce-server-fhna.onrender.com/api/categories")
      .then((res) => {
        setCategories(res.data?.data || []);
      })
      .catch((err) => console.error("Category API error:", err));
  }, []);

  return (
    <>
      {/* ================= HERO ================= */}
      <HomeSlider />
      <HomeCatSlider />
      <br />

      {/* ================= POPULAR PRODUCTS (TABS) ================= */}
      <section className="bg-white py-8">
        <div className="containers">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[25px] font-[600]">Popular Products</h3>

            <div className="w-[65%]">
              <Tabs
                value={tabIndex}
                onChange={(e, v) => setTabIndex(v)}
                variant="scrollable"
                scrollButtons="auto"
              >
                {categories.map((cat) => (
                  <Tab key={cat._id} label={cat.name} />
                ))}
              </Tabs>
            </div>
          </div>

          {/* 🔥 TAB SLIDER */}
          {categories[tabIndex] && (
            <CategorySlider category={categories[tabIndex]} />
          )}
        </div>
      </section>

      {/* ================= OFFER BANNER 1 ================= */}
      <section className="w-full py-6 px-4">
        <div className="bg-gradient-to-r from-[#005c97] to-[#363795] 
                        rounded-2xl flex flex-col md:flex-row items-center 
                        justify-center gap-4 md:gap-8 px-6 py-6 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="bg-red-500 p-3 rounded-full">
              <FaShippingFast className="text-white text-4xl" />
            </div>
            <span className="text-white font-bold text-xl">
              FREE DELIVERY
            </span>
          </div>

          <div className="text-center md:text-left flex-1">
            <p className="text-yellow-300 font-bold text-lg">
              Don’t Wait, Order Today
            </p>
            <p className="text-white font-semibold text-xl md:text-2xl">
              Get your new iPhone delivered within 3 days
            </p>
          </div>

          <div className="text-white/70 text-xs italic">
            *T&C Apply
          </div>
        </div>
      </section>

      <br />
      <AdsBannerSlider items={4} />
      <br />

    

      {/* ================= ALL CATEGORY SECTIONS (AUTO) ================= */}
      {categories.map((cat) => (
        <CategorySlider key={cat._id} category={cat} />
      ))}

      {/* ================= OFFER BANNER 2 ================= */}
      <section className="w-full py-6 px-4">
        <div className="bg-gradient-to-r from-[#FF512F] to-[#DD2476] 
                        rounded-2xl flex flex-col md:flex-row items-center 
                        justify-center gap-4 md:gap-8 px-6 py-6 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-400 p-3 rounded-full">
              <FaTags className="text-white text-4xl" />
            </div>
            <span className="text-white font-bold text-xl">
              BIG DISCOUNT
            </span>
          </div>

          <div className="text-center md:text-left flex-1">
            <p className="text-yellow-200 font-bold text-lg">
              Limited Time Offer
            </p>
            <p className="text-white font-semibold text-xl md:text-2xl">
              Get up to 50% OFF on Fashion & Electronics
            </p>
          </div>

          <div className="text-white/70 text-xs italic">
            *Valid till stock lasts
          </div>
        </div>
      </section>

      <br />
      <AdsBannerSlider items={3} />
      <br />


    </>
  );
};

export default Home;
