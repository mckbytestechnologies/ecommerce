import React, { useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { IoClose } from "react-icons/io5";
import { Button } from "@mui/material";
import { FaPlus, FaMinus, FaTshirt, FaLaptop, FaHome, FaShoppingBag, FaBaby, FaGamepad, FaBook, FaCouch } from "react-icons/fa";
import { GiLipstick, GiKitchenScale, GiSportMedal } from "react-icons/gi";
import { MdOutlineSmartphone, MdLocalOffer } from "react-icons/md";

const CategoryPanel = ({ open, toggleDrawer }) => {
  const [openMenu, setOpenMenu] = useState(null);

  const handleToggle = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const categories = [
    {
      name: "Fashion",
      icon: <FaTshirt className="text-pink-500" />,
      subcategories: ["Men's Fashion", "Women's Fashion", "Kids Fashion", "Accessories", "Footwear"]
    },
    {
      name: "Electronics",
      icon: <FaLaptop className="text-blue-500" />,
      subcategories: ["Smartphones", "Laptops", "Tablets", "Audio", "Cameras"]
    },
    {
      name: "Home & Living",
      icon: <FaHome className="text-green-500" />,
      subcategories: ["Furniture", "Home Decor", "Kitchen", "Bedding", "Lighting"]
    },
    {
      name: "Beauty",
      icon: <GiLipstick className="text-purple-500" />,
      subcategories: ["Skincare", "Makeup", "Hair Care", "Fragrances", "Tools"]
    },
    {
      name: "Sports",
      icon: <GiSportMedal className="text-orange-500" />,
      subcategories: ["Fitness", "Outdoor", "Team Sports", "Swimming", "Yoga"]
    },
    {
      name: "Toys & Games",
      icon: <FaGamepad className="text-red-500" />,
      subcategories: ["Action Figures", "Board Games", "Educational", "Outdoor Toys", "Puzzles"]
    }
  ];

  const DrawerList = (
    <Box
      sx={{
        width: 320,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
      role="presentation"
      className="bg-white"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-200">
        <h3 className="text-lg font-bold text-black">
          SHOP BY CATEGORIES
        </h3>
        <IoClose
          onClick={toggleDrawer(false)}
          className="cursor-pointer text-xl text-black hover:text-red-200 transition"
        />
      </div>

      {/* Scrollable Menu */}
      <div className="flex-1 overflow-y-auto py-2">
        {categories.map((category, index) => (
          <div key={index} className="mb-1 px-3">
            <Button
              onClick={() => handleToggle(category.name)}
              className="w-full !flex !justify-between !items-center !text-left 
                         !capitalize !font-semibold !text-gray-800 hover:!bg-blue-50
                         !py-3 !px-4 !rounded-xl transition-all duration-200 border border-transparent hover:border-blue-200"
            >
              <span className="flex items-center gap-3">
                {category.icon}
                <span className="text-sm">{category.name}</span>
              </span>
              {openMenu === category.name ? (
                <FaMinus className="text-gray-500 text-xs" />
              ) : (
                <FaPlus className="text-gray-500 text-xs" />
              )}
            </Button>
            {openMenu === category.name && (
              <ul className="pl-12 mt-1 space-y-2 animate-fadeIn">
                {category.subcategories.map((sub, subIndex) => (
                  <li key={subIndex}>
                    <Button className="w-full !text-left !py-2 !text-gray-600 hover:!text-blue-600 hover:!bg-blue-50 !rounded-lg !text-sm transition-colors">
                      {sub}
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      <div className="px-4 py-4 border-t border-gray-200 bg-gray-50">
        <div className="text-center mb-3">
          <p className="text-xs text-gray-600 mb-2">🎁 Special offers waiting for you!</p>
        </div>
        <Button
          variant="contained"
          fullWidth
          className="!text-black !bg-gray-200 !rounded-xl !py-3 hover:!from-blue-700 hover:!to-purple-700 transition-all !font-semibold !shadow-lg"
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
        sx: { 
          borderRadius: "0 20px 20px 0", 
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          overflow: "hidden"
        },
      }}
    >
      {DrawerList}
    </Drawer>
  );
};

export default CategoryPanel;