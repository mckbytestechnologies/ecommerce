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
    <header className="bg-white w-full border-b border-gray-200">
      {/* Top Strip */}
      <div className="top-strip py-2 bg-primary w-full hidden sm:block">
        <div className="flex items-center justify-between px-6">
          <div className="col1">
            <p className="text-[13px] font-medium text-white">
              Get Up To 50% off new season styles, limited time only
            </p>
          </div>
          <div className="col2 flex items-center justify-end">
            <ul className="flex items-center gap-5 text-white text-sm">
              <li>
                <Link to="/help-center" className="hover:underline">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/order-tracking" className="hover:underline">
                  Order Tracking
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="py-4 px-4 sm:px-6 flex items-center justify-between">
        {/* Left - Logo */}
        <div className="flex items-center w-1/3 sm:w-1/4">
          <Link to={"/"}>
            <img src="/logo.jpg" alt="Logo" className="w-12 sm:w-14 h-auto" />
          </Link>
        </div>

        {/* Middle - Search (hidden on mobile) */}
        <div className="hidden sm:flex flex-1 px-6">
          <Search />
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-3 w-1/3 sm:w-1/4 justify-end">
          {/* Desktop Auth */}
          <div className="hidden sm:block">
            <Link to="/auth" className="text-sm text-black font-medium">
              Log In
            </Link>{" "}
            |{" "}
            <Link to="/auth" className="text-sm text-black font-medium">
              Register
            </Link>
          </div>

          {/* Desktop Icons */}
          <div className="hidden sm:flex items-center gap-2">
            <IconButton aria-label="compare">
              <StyledBadge badgeContent={4} color="secondary">
                <IoIosGitCompare size={22} />
              </StyledBadge>
            </IconButton>
            <IconButton aria-label="wishlist">
              <StyledBadge badgeContent={4} color="secondary">
                <FaRegHeart size={22} />
              </StyledBadge>
            </IconButton>
            <IconButton aria-label="cart">
              <StyledBadge badgeContent={4} color="secondary">
                <MdShoppingCartCheckout size={22} />
              </StyledBadge>
            </IconButton>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="sm:hidden p-2 rounded-md border border-gray-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <IoClose size={22} /> : <GiHamburgerMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-t border-gray-200 px-4 py-4 space-y-4">
          <Search />

          <div className="flex flex-col gap-3 text-sm">
            <Link to="/auth" className="text-black font-medium">
              Log In / Register
            </Link>
            <Link to="/help-center" className="text-black font-medium">
              Help Center
            </Link>
            <Link to="/order-tracking" className="text-black font-medium">
              Order Tracking
            </Link>
          </div>

          <div className="flex gap-4">
            <IconButton aria-label="compare">
              <StyledBadge badgeContent={2} color="secondary">
                <IoIosGitCompare size={22} />
              </StyledBadge>
            </IconButton>
            <IconButton aria-label="wishlist">
              <StyledBadge badgeContent={3} color="secondary">
                <FaRegHeart size={22} />
              </StyledBadge>
            </IconButton>
            <IconButton aria-label="cart">
              <StyledBadge badgeContent={1} color="secondary">
                <MdShoppingCartCheckout size={22} />
              </StyledBadge>
            </IconButton>
          </div>
        </div>
      )}

      {/* Navigation - always visible on desktop */}
      <div className="hidden sm:block">
        <Navigation />
      </div>
    </header>
  );
};

export default Header;
