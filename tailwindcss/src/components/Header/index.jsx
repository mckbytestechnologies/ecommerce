import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Search from "../Search";
import Navigation from "./Navigation";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import { MdShoppingCartCheckout } from "react-icons/md";
import { IoIosGitCompare } from "react-icons/io";
import { FaRegHeart } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
    padding: "0 4px",
  },
}));

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white w-full border-b border-wjite-200  top-0 z-50">
      {/* Top Strip */}
      <div className="top-strip py-2 bg-gradient-to-r from-white-600 to-white-600 w-full hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6">
          <div className="col1">
            <p className="text-[13px] font-medium text-black">
              🎉 Get Up To 50% off new season styles, limited time only
            </p>
          </div>
          <div className="col2 flex items-center justify-end">
            <ul className="flex items-center gap-5 text-black text-sm">
              <li>
                <Link to="/help-center" className="hover:underline transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/order-tracking" className="hover:underline transition-colors">
                  Order Tracking
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 flex items-center justify-between">
        {/* Left - Logo */}
        <div className="flex items-center w-1/4 lg:w-1/5">
          <Link to={"/"} className="flex items-center gap-3">
            <img src="/logo.jpg" alt="Logo" className="w-10 sm:w-12 h-auto rounded-lg" />
            <span className="hidden sm:block text-xl font-bold text-gray-900">MCK-Bytes</span>
          </Link>
        </div>

        {/* Middle - Search (hidden on mobile) */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-6 lg:mx-8">
          <Search />
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-3 lg:gap-4 w-1/4 lg:w-1/5 justify-end">
          {/* Desktop Auth */}
          <div className="hidden lg:flex items-center gap-2">
            <Link to="/auth" className="text-sm text-gray-700 font-medium hover:text-blue-600 transition-colors">
              Log In
            </Link>
            <span className="text-gray-300">|</span>
            <Link to="/register" className="text-sm text-gray-700 font-medium hover:text-blue-600 transition-colors">
              Register
            </Link>
          </div>

          {/* Desktop Icons */}
          <div className="hidden sm:flex items-center gap-1 lg:gap-2">
            <IconButton aria-label="compare" className="!p-2 hover:bg-gray-100">
              <StyledBadge badgeContent={4} color="error">
                <IoIosGitCompare size={20} className="text-gray-600" />
              </StyledBadge>
            </IconButton>
            <IconButton aria-label="wishlist" className="!p-2 hover:bg-gray-100">
              <StyledBadge badgeContent={4} color="error">
                <FaRegHeart size={20} className="text-gray-600" />
              </StyledBadge>
            </IconButton>
            <IconButton aria-label="cart" className="!p-2 hover:bg-gray-100">
              <StyledBadge badgeContent={4} color="error">
                <MdShoppingCartCheckout size={20} className="text-gray-600" />
              </StyledBadge>
            </IconButton>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <IoClose size={20} /> : <GiHamburgerMenu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-4 space-y-4 shadow-lg">
          {/* Mobile Search */}
          <div className="pb-2">
            <Search />
          </div>

          {/* Mobile Navigation Links */}
          <div className="flex flex-col gap-2 text-sm border-t border-gray-100 pt-3">
            <Link to="/auth" className="text-gray-700 font-medium py-2 hover:text-blue-600 transition-colors">
              Log In / Register
            </Link>
            <Link to="/help-center" className="text-gray-700 font-medium py-2 hover:text-blue-600 transition-colors">
              Help Center
            </Link>
            <Link to="/order-tracking" className="text-gray-700 font-medium py-2 hover:text-blue-600 transition-colors">
              Order Tracking
            </Link>
          </div>

          {/* Mobile Action Icons */}
          <div className="flex gap-4 border-t border-gray-100 pt-3">
            <IconButton aria-label="compare" className="!p-2 hover:bg-gray-100">
              <StyledBadge badgeContent={2} color="error">
                <IoIosGitCompare size={20} className="text-gray-600" />
              </StyledBadge>
            </IconButton>
            <IconButton aria-label="wishlist" className="!p-2 hover:bg-gray-100">
              <StyledBadge badgeContent={3} color="error">
                <FaRegHeart size={20} className="text-gray-600" />
              </StyledBadge>
            </IconButton>
            <IconButton aria-label="cart" className="!p-2 hover:bg-gray-100">
              <StyledBadge badgeContent={1} color="error">
                <MdShoppingCartCheckout size={20} className="text-gray-600" />
              </StyledBadge>
            </IconButton>
          </div>
        </div>
      )}

      {/* Navigation - visible on all devices except mobile when menu is open */}
      <div className={mobileMenuOpen ? "hidden md:block" : "block"}>
        <Navigation />
      </div>
    </header>
  );
};

export default Header;