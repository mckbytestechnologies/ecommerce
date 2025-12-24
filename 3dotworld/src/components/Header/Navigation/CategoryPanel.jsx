import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { IoClose } from "react-icons/io5";
import { Button } from "@mui/material";
import { FaPlus, FaMinus } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CategoryPanel = ({ open, toggleDrawer }) => {
  const navigate = useNavigate();

  const [openMenu, setOpenMenu] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Toggle subcategory accordion
  const handleToggle = (id) => {
    setOpenMenu(openMenu === id ? null : id);
  };

  // Navigate to product listing by category
  const handleCategoryClick = (categoryName) => {
    navigate(`/productlisting?category=${encodeURIComponent(categoryName)}`);
    toggleDrawer(false)(); // close drawer
  };

  // Navigate with subcategory
  const handleSubCategoryClick = (categoryName, subCategory) => {
    navigate(
      `/productlisting?category=${encodeURIComponent(
        categoryName
      )}&subCategory=${encodeURIComponent(subCategory)}`
    );
    toggleDrawer(false)(); // close drawer
  };

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("https://ecommerce-server-fhna.onrender.com/api/categories");
        setCategories(res.data.data || []);
      } catch (err) {
        console.error("Category fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const getCategoryImage = (category) => {
    return category.image?.url || "/homecat/default.jpg";
  };

  const DrawerList = (
    <Box
      sx={{
        width: 320,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
      className="bg-white"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b bg-red-600">
        <h3 className="text-lg font-bold text-white">
          SHOP BY CATEGORIES
        </h3>
        <IoClose
          onClick={toggleDrawer(false)}
          className="cursor-pointer text-xl text-white hover:text-red-200"
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto py-3">
        {loading ? (
          <p className="text-center text-gray-400">Loading categories...</p>
        ) : categories.length === 0 ? (
          <p className="text-center text-gray-400">No categories found</p>
        ) : (
          categories.map((category) => (
            <div key={category._id} className="px-3 mb-2">
              {/* Category Button */}
              <Button
                onClick={() => handleCategoryClick(category.name)}
                className="w-full !flex !justify-between !items-center
                           !text-left !capitalize !font-semibold
                           !text-gray-800 hover:!bg-red-50
                           !rounded-xl !py-3 !px-4
                           border border-transparent hover:border-red-300"
              >
                <span className="flex items-center gap-3">
                  <img
                    src={getCategoryImage(category)}
                    alt={category.name}
                    className="w-8 h-8 rounded object-cover border border-red-200"
                    onError={(e) => (e.target.src = "/homecat/default.jpg")}
                  />
                  <span className="text-sm">{category.name}</span>
                </span>

                {category.subcategories?.length > 0 && (
                  openMenu === category._id ? (
                    <FaMinus
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggle(category._id);
                      }}
                      className="text-red-500 text-xs"
                    />
                  ) : (
                    <FaPlus
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggle(category._id);
                      }}
                      className="text-gray-500 text-xs"
                    />
                  )
                )}
              </Button>

              {/* Subcategories */}
              {openMenu === category._id &&
                category.subcategories?.length > 0 && (
                  <ul className="pl-12 mt-2 space-y-2">
                    {category.subcategories.map((sub, index) => (
                      <li key={index}>
                        <Button
                          onClick={() =>
                            handleSubCategoryClick(category.name, sub)
                          }
                          className="w-full !text-left !py-2
                                     !text-gray-600 hover:!text-red-600
                                     hover:!bg-red-50
                                     !rounded-lg !text-sm"
                        >
                          {sub}
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-4 border-t bg-white">
        <Button
          variant="contained"
          fullWidth
          onClick={() => {
            navigate("/productlisting");
            toggleDrawer(false)();
          }}
          className="!bg-red-600 hover:!bg-red-700
                     !text-white !rounded-xl !py-3
                     !font-semibold !shadow-md"
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
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
        },
      }}
    >
      {DrawerList}
    </Drawer>
  );
};

export default CategoryPanel;
