import React, { useState } from "react";
import { RiMenu2Fill } from "react-icons/ri";
import { TfiAngleDown } from "react-icons/tfi";
import { Link } from "react-router-dom";
import { GoRocket } from "react-icons/go";
import CategoryPanel from "./CategoryPanel";

const Navigation = () => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  return (
    <>
      <nav className="py-4 bg-white shadow-md border-b">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between px-6">
          {/* Left: Categories */}
          <div className="flex items-center gap-2 w-1/5">
            <button
              onClick={toggleDrawer(true)}
              className="flex items-center text-black font-medium hover:text-blue-600"
            >
              <RiMenu2Fill size={20} /> SHOP BY CATEGORIES
            </button>
          </div>

          {/* Center: Menu Links */}
          <div className="flex-1 flex justify-center">
            <ul className="flex items-center gap-6">

              {/* HOME */}
              <li>
                <Link
                  to="/"
                  className="transition text-[16px] font-[500] hover:text-blue-600"
                >
                  HOME
                </Link>
              </li>

              {/* FASHION Mega Menu */}
              <li className="relative group">
                <button className="flex items-center gap-1 text-[16px] font-[500] hover:text-blue-600">
                  FASHION <TfiAngleDown size={12} />
                </button>
                <div
                  className="absolute top-[100%] left-0 w-[700px] shadow-xl p-6 hidden group-hover:grid grid-cols-4 gap-6 z-50"
                  style={{
                    backgroundImage: "url(/nav/fashion-banner.jpg)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  <div className="bg-white/70 p-4 rounded">
                    <h4 className="font-semibold mb-3">Men</h4>
                    <ul className="space-y-2 text-gray-800">
                      <li><Link to="/">Shirts</Link></li>
                      <li><Link to="/">T-Shirts</Link></li>
                      <li><Link to="/">Jeans</Link></li>
                      <li><Link to="/">Shoes</Link></li>
                    </ul>
                  </div>
                  <div className="bg-white/70 p-4 rounded">
                    <h4 className="font-semibold mb-3">Women</h4>
                    <ul className="space-y-2 text-gray-800">
                      <li><Link to="/">Dresses</Link></li>
                      <li><Link to="/">Tops</Link></li>
                      <li><Link to="/">Skirts</Link></li>
                      <li><Link to="/">Handbags</Link></li>
                    </ul>
                  </div>
                  <div className="bg-white/70 p-4 rounded">
                    <h4 className="font-semibold mb-3">Kids</h4>
                    <ul className="space-y-2 text-gray-800">
                      <li><Link to="/">Boys</Link></li>
                      <li><Link to="/">Girls</Link></li>
                      <li><Link to="/">Shoes</Link></li>
                      <li><Link to="/">Accessories</Link></li>
                    </ul>
                  </div>
                  <div className="bg-white/70 p-4 rounded">
                    <h4 className="font-semibold mb-3">Featured</h4>
                    <p className="text-gray-700">Check out our latest collections!</p>
                  </div>
                </div>
              </li>

              {/* BAGS Mega Menu */}
              <li className="relative group">
                <button className="flex items-center gap-1 text-[16px] font-[500] hover:text-blue-600">
                  BAGS <TfiAngleDown size={12} />
                </button>
                <div
                  className="absolute top-[100%] left-0 w-[700px] shadow-xl p-6 hidden group-hover:grid grid-cols-4 gap-6 z-50"
                  style={{
                    backgroundImage: "url(/nav/bags-banner.jpg)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  <div className="bg-white/70 p-4 rounded">
                    <h4 className="font-semibold mb-3">Handbags</h4>
                    <ul className="space-y-2 text-gray-800">
                      <li><Link to="/">Crossbody</Link></li>
                      <li><Link to="/">Totes</Link></li>
                      <li><Link to="/">Clutches</Link></li>
                      <li><Link to="/">Travel Bags</Link></li>
                    </ul>
                  </div>
                  <div className="bg-white/70 p-4 rounded">
                    <h4 className="font-semibold mb-3">Backpacks</h4>
                    <ul className="space-y-2 text-gray-800">
                      <li><Link to="/">Casual</Link></li>
                      <li><Link to="/">Laptop</Link></li>
                      <li><Link to="/">Sports</Link></li>
                    </ul>
                  </div>
                  <div className="bg-white/70 p-4 rounded">
                    <h4 className="font-semibold mb-3">Wallets</h4>
                    <ul className="space-y-2 text-gray-800">
                      <li><Link to="/">Leather Wallets</Link></li>
                      <li><Link to="/">Card Holders</Link></li>
                    </ul>
                  </div>
                  <div className="bg-white/70 p-4 rounded">
                    <h4 className="font-semibold mb-3">Featured</h4>
                    <p className="text-gray-700">Shop premium bags collection!</p>
                  </div>
                </div>
              </li>

              {/* FOOTWEAR Mega Menu */}
              <li className="relative group">
                <button className="flex items-center gap-1 text-[16px] font-[500] hover:text-blue-600">
                  FOOTWEAR <TfiAngleDown size={12} />
                </button>
                <div
                  className="absolute top-[100%] left-0 w-[700px] shadow-xl p-6 hidden group-hover:grid grid-cols-4 gap-6 z-50"
                  style={{
                    backgroundImage: "url(/nav/footwear-banner.jpg)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  <div className="bg-white/70 p-4 rounded">
                    <h4 className="font-semibold mb-3">Men</h4>
                    <ul className="space-y-2 text-gray-800">
                      <li><Link to="/">Sneakers</Link></li>
                      <li><Link to="/">Sports Shoes</Link></li>
                      <li><Link to="/">Formal Shoes</Link></li>
                    </ul>
                  </div>
                  <div className="bg-white/70 p-4 rounded">
                    <h4 className="font-semibold mb-3">Women</h4>
                    <ul className="space-y-2 text-gray-800">
                      <li><Link to="/">Heels</Link></li>
                      <li><Link to="/">Flats</Link></li>
                      <li><Link to="/">Boots</Link></li>
                    </ul>
                  </div>
                  <div className="bg-white/70 p-4 rounded">
                    <h4 className="font-semibold mb-3">Kids</h4>
                    <ul className="space-y-2 text-gray-800">
                      <li><Link to="/">Boys</Link></li>
                      <li><Link to="/">Girls</Link></li>
                    </ul>
                  </div>
                  <div className="bg-white/70 p-4 rounded">
                    <h4 className="font-semibold mb-3">Featured</h4>
                    <p className="text-gray-700">Discover new arrivals!</p>
                  </div>
                </div>
              </li>

              {/* Simple links */}
              <li><Link to="/groceries" className="transition text-[16px] font-[500] hover:text-blue-600">GROCERIES</Link></li>
              <li><Link to="/beauty" className="transition text-[16px] font-[500] hover:text-blue-600">BEAUTY</Link></li>
              <li><Link to="/wellness" className="transition text-[16px] font-[500] hover:text-blue-600">WELLNESS</Link></li>
              <li><Link to="/jewellery" className="transition text-[16px] font-[500] hover:text-blue-600">JEWELLERY</Link></li>

            </ul>
          </div>

          {/* Right: Free Delivery */}
          <div className="flex items-center justify-end w-1/5">
            <p className="flex items-center gap-2 text-[16px] font-[500] text-gray-700">
              <GoRocket className="text-blue-500" /> Free Delivery
            </p>
          </div>
        </div>
      </nav>

      {/* Drawer */}
      <CategoryPanel open={open} toggleDrawer={toggleDrawer} />
    </>
  );
};

export default Navigation;
