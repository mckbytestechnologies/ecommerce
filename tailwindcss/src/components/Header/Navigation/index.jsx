import React, { useState, useEffect, useRef } from "react";
import { RiMenu2Fill } from "react-icons/ri";
import { TfiAngleDown, TfiAngleUp } from "react-icons/tfi";
import { Link } from "react-router-dom";
import { GoRocket } from "react-icons/go";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import CategoryPanel from "./CategoryPanel";

const Navigation = () => {
  const [open, setOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const sliderRef = useRef(null);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const toggleMegaMenu = (index) => {
    // Closes if the same one is clicked, opens otherwise
    setActiveMegaMenu(activeMegaMenu === index ? null : index);
  };

  const menuItems = [
    {
      name: "HOME",
      type: "simple",
      link: "/"
    },
    {
      name: "FASHION",
      type: "mega",
      background: "/nav/fashion-banner.jpg",
      columns: [
        {
          title: "Men",
          items: ["Shirts", "T-Shirts", "Jeans", "Shoes"]
        },
        {
          title: "Women",
          items: ["Dresses", "Tops", "Skirts", "Handbags"]
        },
        {
          title: "Kids",
          items: ["Boys", "Girls", "Shoes", "Accessories"]
        },
      ]
    },
    {
      name: "BAGS",
      type: "mega",
      background: "/nav/bags-banner.jpg",
      columns: [
        {
          title: "Handbags",
          items: ["Crossbody", "Totes", "Clutches", "Travel Bags"]
        },
        {
          title: "Backpacks",
          items: ["Casual", "Laptop", "Sports"]
        },
        {
          title: "Wallets",
          items: ["Leather Wallets", "Card Holders"]
        },
      ]
    },
    {
      name: "FOOTWEAR",
      type: "mega",
      background: "/nav/footwear-banner.jpg",
      columns: [
        {
          title: "Men",
          items: ["Sneakers", "Sports Shoes", "Formal Shoes"]
        },
        {
          title: "Women",
          items: ["Heels", "Flats", "Boots"]
        },
        {
          title: "Kids",
          items: ["Boys", "Girls"]
        },
      ]
    },
    {
      name: "GROCERIES",
      type: "simple",
      link: "/groceries"
    },
    {
      name: "BEAUTY",
      type: "simple",
      link: "/beauty"
    },
    {
      name: "WELLNESS",
      type: "simple",
      link: "/wellness"
    },
    {
      name: "JEWELLERY",
      type: "simple",
      link: "/jewellery"
    }
  ];

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollLeft -= 100;
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollLeft += 100;
    }
  };

  // 1. DESKTOP Mega Menu Component (from previous response)
  const DesktopMegaMenu = ({ item }) => (
    <div className="absolute top-full left-0 w-[650px] shadow-2xl p-6 hidden group-hover:grid grid-cols-4 gap-6 z-50 bg-white border border-gray-200 rounded-xl backdrop-blur-sm bg-white/95">
      {/* Content Columns (First three columns) */}
      {item.columns.map((column, colIndex) => (
        <div key={colIndex} className="space-y-3">
          <h4 className="font-bold text-gray-900 text-lg border-b border-gray-100 pb-2">{column.title}</h4>
          {column.items ? (
            <ul className="space-y-2">
              {column.items.map((subItem, subIndex) => (
                <li key={subIndex}>
                  <Link 
                    to="/" 
                    className="text-gray-600 hover:text-blue-600 transition-colors text-sm block py-1 hover:translate-x-1 transform transition-transform"
                  >
                    {subItem}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm leading-relaxed">{column.description}</p>
          )}
        </div>
      ))}
      
      {/* IMAGE COLUMN (Fourth column) */}
      {item.background && (
        <div className="col-span-1 overflow-hidden rounded-lg shadow-md">
          <img
            src={item.background}
            alt={`${item.name} promotion`}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}
    </div>
  );

  // 2. NEW: Mobile Mega Menu Component
  const MobileMegaMenu = ({ item }) => (
    <div className="mt-2 p-4 bg-white border border-gray-200 shadow-lg rounded-xl transition-all duration-300 overflow-hidden">
      {/* Background Image Banner */}
      {item.background && (
        <div className="w-full h-24 overflow-hidden mb-4 rounded-lg">
          <img
            src={item.background}
            alt={`${item.name} promotion`}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content Columns (2 columns layout for mobile) */}
      <div className="grid grid-cols-2 gap-4">
        {item.columns.map((column, colIndex) => (
          <div key={colIndex} className="space-y-2">
            <h4 className="font-bold text-gray-900 text-sm border-b border-gray-100 pb-1">{column.title}</h4>
            {column.items && (
              <ul className="space-y-1">
                {column.items.map((subItem, subIndex) => (
                  <li key={subIndex}>
                    <Link 
                      to="/" 
                      className="text-gray-600 hover:text-blue-600 transition-colors text-xs block"
                    >
                      {subItem}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // Get the active item for the mobile menu
  const activeItem = activeMegaMenu !== null ? menuItems[activeMegaMenu] : null;


  return (
    <>
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          {/* Desktop & Tablet Layout (No change) */}
          <div className="hidden lg:block">
            <div className="flex items-center justify-between px-6 py-3">
              {/* Left: Categories */}
              <div className="flex items-center">
                <button
                  onClick={toggleDrawer(true)}
                  className="flex items-center gap-2 text-gray-800 font-semibold hover:text-blue-600 transition-colors py-2 px-4 bg-gray-50 hover:bg-blue-50 rounded-lg"
                >
                  <RiMenu2Fill size={18} />
                  <span className="text-sm">ALL CATEGORIES</span>
                </button>
              </div>

              {/* Center: Menu Links */}
              <div className="flex-1 flex justify-center">
                <ul className="flex items-center gap-8">
                  {menuItems.map((item, index) => (
                    <li key={index} className="relative group">
                      {item.type === "mega" ? (
                        <>
                          <button className="flex items-center gap-1 text-sm font-semibold text-gray-800 hover:text-blue-600 transition-colors py-2 group-hover:bg-blue-50 px-3 rounded-lg group-hover:text-blue-600">
                            {item.name} <TfiAngleDown size={12} className="group-hover:rotate-180 transition-transform" />
                          </button>
                          <DesktopMegaMenu item={item} />
                        </>
                      ) : (
                        <Link
                          to={item.link}
                          className="text-sm font-semibold text-gray-800 hover:text-blue-600 transition-colors py-2 block hover:bg-blue-50 px-3 rounded-lg"
                        >
                          {item.name}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right: Free Delivery */}
              <div className="flex items-center">
                <p className="flex items-center gap-2 text-sm font-semibold text-gray-700 bg-green-50 px-4 py-2 rounded-lg">
                  <GoRocket className="text-green-600" /> 
                  <span>Free Delivery</span>
                </p>
              </div>
            </div>
          </div>

          {/* Mobile & Tablet Slider Layout */}
          <div className="lg:hidden">
            <div className="px-4 py-3">
              {/* Top Row */}
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={toggleDrawer(true)}
                  className="flex items-center gap-2 text-gray-800 font-semibold hover:text-blue-600 transition-colors p-2 bg-gray-50 hover:bg-blue-50 rounded-lg"
                >
                  <RiMenu2Fill size={18} />
                  <span className="text-xs">CATEGORIES</span>
                </button>
                
                <p className="flex items-center gap-2 text-xs font-semibold text-gray-700 bg-green-50 px-3 py-2 rounded-lg">
                  <GoRocket className="text-green-600" />
                  <span>Free Delivery</span>
                </p>
              </div>

              {/* Navigation Slider */}
              <div className="flex items-center gap-2">
                {/* Left Arrow */}
                <button
                  onClick={scrollLeft}
                  className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors flex-shrink-0"
                >
                  <IoIosArrowBack size={16} className="text-gray-600" />
                </button>

                {/* Slider Container */}
                <div
                  ref={sliderRef}
                  className="flex-1 overflow-x-auto scrollbar-hide scroll-smooth"
                  style={{ scrollBehavior: 'smooth' }}
                >
                  <div className="flex items-center space-x-1 py-1 min-w-max">
                    {menuItems.map((item, index) => (
                      <div key={index} className="flex-shrink-0">
                        {item.type === "simple" ? (
                          <Link
                            to={item.link}
                            className="text-xs font-semibold text-gray-700 hover:text-blue-600 whitespace-nowrap transition-colors px-3 py-2 rounded-lg hover:bg-blue-50 block border border-transparent hover:border-blue-200"
                          >
                            {item.name}
                          </Link>
                        ) : (
                          <button 
                            onClick={() => toggleMegaMenu(index)}
                            // Highlight the active button
                            className={`text-xs font-semibold whitespace-nowrap transition-colors px-3 py-2 rounded-lg flex items-center gap-1 border border-transparent 
                                ${activeMegaMenu === index 
                                  ? 'bg-blue-100 text-blue-700 border-blue-300' 
                                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200'
                                }`}
                          >
                            {item.name} 
                            {activeMegaMenu === index ? 
                              <TfiAngleUp size={10} /> : 
                              <TfiAngleDown size={10} />
                            }
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Arrow */}
                <button
                  onClick={scrollRight}
                  className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors flex-shrink-0"
                >
                  <IoIosArrowForward size={16} className="text-gray-600" />
                </button>
              </div>

              {/* 3. CONDITIONAL RENDERING OF MOBILE MEGA MENU */}
              {activeItem && activeItem.type === 'mega' && (
                <MobileMegaMenu item={activeItem} />
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Drawer */}
      <CategoryPanel open={open} toggleDrawer={toggleDrawer} />

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
};

export default Navigation;