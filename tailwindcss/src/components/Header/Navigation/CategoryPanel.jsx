import React, { useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { IoClose } from "react-icons/io5";
import { Button } from "@mui/material";
import { FaPlus, FaMinus, FaTshirt, FaLaptop, FaHome } from "react-icons/fa";
import { GiShoppingBag } from "react-icons/gi";
import { MdOutlineBrandingWatermark } from "react-icons/md";

const CategoryPanel = ({ open, toggleDrawer }) => {
  const [openMenu, setOpenMenu] = useState(null);

  const handleToggle = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const DrawerList = (
    <Box
      sx={{
        width: 280,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
      role="presentation"
      className="bg-white"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h3 className="text-[18px] font-semibold text-gray-800">
          SHOP BY CATEGORIES
        </h3>
        <IoClose
          onClick={toggleDrawer(false)}
          className="cursor-pointer text-[22px] text-gray-600 hover:text-red-500 transition"
        />
      </div>

      {/* Scrollable Menu */}
      <div className="flex-1 overflow-y-auto p-3">
        {/* Fashion */}
        <div className="mb-2">
          <Button
            onClick={() => handleToggle("fashion")}
            className="w-full !flex !justify-between !items-center !text-left 
                       !capitalize !font-medium !text-gray-800 hover:!bg-gray-100
                       !py-2 !px-3 !rounded-lg transition"
          >
            <span className="flex items-center gap-2">
              <FaTshirt className="text-pink-500" /> Fashion
            </span>
            {openMenu === "fashion" ? (
              <FaMinus className="ml-2 text-gray-500" />
            ) : (
              <FaPlus className="ml-2 text-gray-500" />
            )}
          </Button>
          {openMenu === "fashion" && (
            <ul className="pl-8 mt-1 space-y-1 animate-fadeIn">
              <li>
                <Button className="w-full !text-left !py-1 !text-gray-600 hover:!text-blue-600">
                  Men
                </Button>
              </li>
              <li>
                <Button className="w-full !text-left !py-1 !text-gray-600 hover:!text-blue-600">
                  Women
                </Button>
              </li>
              <li>
                <Button className="w-full !text-left !py-1 !text-gray-600 hover:!text-blue-600">
                  Kids
                </Button>
              </li>
            </ul>
          )}
        </div>

        {/* Brand */}
        <div className="mb-2">
          <Button
            onClick={() => handleToggle("brand")}
            className="w-full !flex !justify-between !items-center !text-left 
                       !capitalize !font-medium !text-gray-800 hover:!bg-gray-100
                       !py-2 !px-3 !rounded-lg transition"
          >
            <span className="flex items-center gap-2">
              <MdOutlineBrandingWatermark className="text-purple-500" /> Brand
            </span>
            {openMenu === "brand" ? (
              <FaMinus className="ml-2 text-gray-500" />
            ) : (
              <FaPlus className="ml-2 text-gray-500" />
            )}
          </Button>
          {openMenu === "brand" && (
            <ul className="pl-8 mt-1 space-y-1 animate-fadeIn">
              <li>
                <Button className="w-full !text-left !py-1 !text-gray-600 hover:!text-blue-600">
                  Nike
                </Button>
              </li>
              <li>
                <Button className="w-full !text-left !py-1 !text-gray-600 hover:!text-blue-600">
                  Adidas
                </Button>
              </li>
              <li>
                <Button className="w-full !text-left !py-1 !text-gray-600 hover:!text-blue-600">
                  Zara
                </Button>
              </li>
            </ul>
          )}
        </div>

        {/* Electronics */}
        <div className="mb-2">
          <Button
            onClick={() => handleToggle("electronics")}
            className="w-full !flex !justify-between !items-center !text-left 
                       !capitalize !font-medium !text-gray-800 hover:!bg-gray-100
                       !py-2 !px-3 !rounded-lg transition"
          >
            <span className="flex items-center gap-2">
              <FaLaptop className="text-blue-500" /> Electronics
            </span>
            {openMenu === "electronics" ? (
              <FaMinus className="ml-2 text-gray-500" />
            ) : (
              <FaPlus className="ml-2 text-gray-500" />
            )}
          </Button>
          {openMenu === "electronics" && (
            <ul className="pl-8 mt-1 space-y-1 animate-fadeIn">
              <li>
                <Button className="w-full !text-left !py-1 !text-gray-600 hover:!text-blue-600">
                  Mobiles
                </Button>
              </li>
              <li>
                <Button className="w-full !text-left !py-1 !text-gray-600 hover:!text-blue-600">
                  Laptops
                </Button>
              </li>
              <li>
                <Button className="w-full !text-left !py-1 !text-gray-600 hover:!text-blue-600">
                  Accessories
                </Button>
              </li>
            </ul>
          )}
        </div>

        {/* Home & Living */}
        <div className="mb-2">
          <Button
            onClick={() => handleToggle("home")}
            className="w-full !flex !justify-between !items-center !text-left 
                       !capitalize !font-medium !text-gray-800 hover:!bg-gray-100
                       !py-2 !px-3 !rounded-lg transition"
          >
            <span className="flex items-center gap-2">
              <FaHome className="text-green-500" /> Home & Living
            </span>
            {openMenu === "home" ? (
              <FaMinus className="ml-2 text-gray-500" />
            ) : (
              <FaPlus className="ml-2 text-gray-500" />
            )}
          </Button>
          {openMenu === "home" && (
            <ul className="pl-8 mt-1 space-y-1 animate-fadeIn">
              <li>
                <Button className="w-full !text-left !py-1 !text-gray-600 hover:!text-blue-600">
                  Furniture
                </Button>
              </li>
              <li>
                <Button className="w-full !text-left !py-1 !text-gray-600 hover:!text-blue-600">
                  Decor
                </Button>
              </li>
              <li>
                <Button className="w-full !text-left !py-1 !text-gray-600 hover:!text-blue-600">
                  Kitchen
                </Button>
              </li>
            </ul>
          )}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="px-4 py-3 border-t border-gray-200">
        <Button
          variant="contained"
          color="primary"
          fullWidth
          className="!bg-blue-600 !rounded-lg !py-2 hover:!bg-blue-700 transition"
        >
          View All Categories
        </Button>
      </div>
    </Box>
  );

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={toggleDrawer(false)}
      PaperProps={{
        sx: { borderRadius: "0 12px 12px 0", boxShadow: 6 },
      }}
    >
      {DrawerList}
    </Drawer>
  );
};

export default CategoryPanel;
