import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { RxDashboard } from "react-icons/rx";
import { FaImages, FaAngleDown } from "react-icons/fa6";
import { FaUserGraduate } from "react-icons/fa";
import { MdProductionQuantityLimits } from "react-icons/md";
import { TbCategory } from "react-icons/tb";
import { LuBaggageClaim } from "react-icons/lu";
import { CiLogout } from "react-icons/ci";
import { Collapse } from 'react-collapse';

const Sidebar = () => {
  const [submenuIndex, setSubmenuIndex] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSubmenu = (index) => {
    if (submenuIndex === index) {
      setSubmenuIndex(null);
    } else {
      setSubmenuIndex(index);
    }
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="md:hidden p-2 bg-gray-500 text-white flex justify-between items-center">
        <h1 className="text-lg font-bold">Menu</h1>
        <Button onClick={() => setMobileOpen(!mobileOpen)}>
          <FaAngleDown className={`transform transition-transform ${mobileOpen ? 'rotate-180' : 'rotate-0'}`} />
        </Button>
      </div>

      {/* Sidebar */}
      <div className={`sidebar fixed top-0 left-0 h-full bg-gray-200 px-2 py-4 w-64 transform md:translate-x-0 transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 z-50`}>
        <div className='py-2 w-full flex justify-center'>
          <Link to="/">
            <img
              src="https://www.mckbytes.com/wp-content/uploads/2024/02/Mckbytes-logo-digital-marketing-3.png"
              alt="Logo"
              className="h-12 object-contain"
            />
          </Link>
        </div>

        <ul className="space-y-2 mt-6">
  {/* Dashboard */}
  <li>
    <Button className="w-full flex items-center gap-3 px-4 py-2 text-[18px] font-semibold text-blue-600 rounded-lg hover:bg-gray-100 transition-all justify-start">
      <RxDashboard className="text-[20px]" />
      Dashboard
    </Button>
  </li>

  {/* Home Slide with Submenu */}
  <li>
    <Button
      onClick={() => toggleSubmenu(1)}
      className="w-full flex items-center gap-3 px-4 py-2 text-[18px] font-semibold text-blue-600 rounded-lg hover:bg-gray-100 transition-all justify-start"
    >
      <FaImages className="text-[20px]" />
      Home Slide
      <FaAngleDown
        className={`text-[16px] transform transition-transform ${submenuIndex === 1 ? 'rotate-180' : 'rotate-0'}`}
      />
    </Button>
    <Collapse isOpened={submenuIndex === 1}>
      <ul className="ml-8 mt-1 space-y-1">
        <li>
          <Button className="w-full justify-start text-[16px] text-blue-600 hover:text-blue-800 !capitalize">
            Slide 1
          </Button>
        </li>
        <li>
          <Button className="w-full justify-start text-[16px] text-blue-600 hover:text-blue-800 !capitalize">
            Slide 2
          </Button>
        </li>
      </ul>
    </Collapse>
  </li>

  {/* User */}
  <li>
    <Button className="w-full flex items-center gap-3 px-4 py-2 text-[18px] font-semibold text-blue-600 rounded-lg hover:bg-gray-100 transition-all justify-start">
      <FaUserGraduate className="text-[20px]" /> User
    </Button>
  </li>

  {/* Product */}
  <li>
    <Button
      onClick={() => toggleSubmenu(2)}
      className="w-full flex items-center gap-3 px-4 py-2 text-[18px] font-semibold text-blue-600 rounded-lg hover:bg-gray-100 transition-all justify-start"
    >
      <MdProductionQuantityLimits className="text-[20px]" />
      Product
      <FaAngleDown
        className={`text-[16px] transform transition-transform ${submenuIndex === 2 ? 'rotate-180' : 'rotate-0'}`}
      />
    </Button>
    <Collapse isOpened={submenuIndex === 2}>
      <ul className="ml-8 mt-1 space-y-1">
        <li>
          <Button className="w-full justify-start text-[16px] text-blue-600 hover:text-blue-800 !capitalize">
            Add Product
          </Button>
        </li>
        <li>
          <Button className="w-full justify-start text-[16px] text-blue-600 hover:text-blue-800 !capitalize">
            All Products
          </Button>
        </li>
      </ul>
    </Collapse>
  </li>

  {/* Category */}
  <li>
    <Button
      onClick={() => toggleSubmenu(3)}
      className="w-full flex items-center gap-3 px-4 py-2 text-[18px] font-semibold text-blue-600 rounded-lg hover:bg-gray-100 transition-all justify-start"
    >
      <TbCategory className="text-[20px]" />
      Category
      <FaAngleDown
        className={`text-[16px] transform transition-transform ${submenuIndex === 3 ? 'rotate-180' : 'rotate-0'}`}
      />
    </Button>
    <Collapse isOpened={submenuIndex === 3}>
      <ul className="ml-8 mt-1 space-y-1">
        <li>
          <Button className="w-full justify-start text-[16px] text-blue-600 hover:text-blue-800 !capitalize">
            Add Category
          </Button>
        </li>
        <li>
          <Button className="w-full justify-start text-[16px] text-blue-600 hover:text-blue-800 !capitalize">
            All Categories
          </Button>
        </li>
      </ul>
    </Collapse>
  </li>

  {/* Orders */}
  <li>
    <Button className="w-full flex items-center gap-3 px-4 py-2 text-[18px] font-semibold text-blue-600 rounded-lg hover:bg-gray-100 transition-all justify-start">
      <LuBaggageClaim className="text-[20px]" /> Orders
    </Button>
  </li>

  {/* Logout */}
  <li>
    <Button className="w-full flex items-center gap-3 px-4 py-2 text-[18px] font-semibold text-blue-600 rounded-lg hover:bg-gray-100 transition-all justify-start">
      <CiLogout className="text-[20px]" /> Log Out
    </Button>
  </li>
</ul>

      </div>
    </>
  );
};

export default Sidebar;
