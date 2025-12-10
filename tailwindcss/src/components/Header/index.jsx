import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Search from "../Search";
import Navigation from "./Navigation";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import { MdShoppingCartCheckout } from "react-icons/md";
import { IoIosGitCompare } from "react-icons/io";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import axios from "axios";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
    padding: "0 4px",
  },
}));

const Header = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Get auth token
  const getToken = () => {
    return localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
  };

  // Fetch wishlist count
  const fetchWishlistCount = async () => {
    try {
      const token = getToken();
      
      if (!token) {
        setWishlistCount(0);
        return;
      }

      const response = await axios.get("http://localhost:5000/api/wishlist", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        const count = response.data.data?.items?.length || 0;
        setWishlistCount(count);
      }
    } catch (error) {
      // If unauthorized, user is logged out
      if (error.response?.status === 401) {
        setIsLoggedIn(false);
        setWishlistCount(0);
      }
    }
  };

  // Check login status and fetch wishlist count
  useEffect(() => {
    const token = getToken();
    const loggedIn = !!token;
    setIsLoggedIn(loggedIn);

    if (loggedIn) {
      fetchWishlistCount();
    } else {
      setWishlistCount(0);
    }

    // Poll for wishlist updates every 10 seconds
    const interval = setInterval(() => {
      if (loggedIn) {
        fetchWishlistCount();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Listen for wishlist updates from other components
  useEffect(() => {
    const handleWishlistUpdate = () => {
      if (isLoggedIn) {
        fetchWishlistCount();
      }
    };

    // Custom event for wishlist updates
    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    
    return () => {
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
    };
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    setIsLoggedIn(false);
    setWishlistCount(0);
    navigate("/auth");
  };

  const handleWishlistClick = () => {
    if (isLoggedIn) {
      navigate("/wishlist");
    } else {
      navigate("/auth");
    }
  };

  return (
    <header className="bg-white w-full border-b border-wjite-200 top-0 z-50">
      {/* Top Strip */}
      <div className="top-strip py-2 bg-gradient-to-r from-white-600 to-white-600 w-full hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6">
          <p className="text-[13px] font-medium text-black">
            🎉 Get Up To 50% off new season styles, limited time only
          </p>

          <ul className="flex items-center gap-5 text-black text-sm">
            <li>
              <Link to="/help-center" className="hover:underline">
                Help Center
              </Link>
            </li>
            <li>
              <Link to="/shipping-tracking" className="hover:underline">
                Order Tracking
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.jpg" alt="Logo" className="w-10 sm:w-12 rounded-lg" />
          <span className="hidden sm:block text-xl font-bold text-gray-900">
            3Dotworld
          </span>
        </Link>

        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-6 lg:mx-8">
          <Search />
        </div>

        {/* Right Side Buttons */}
        <div className="flex items-center gap-3 lg:gap-4">

          {/* Auth Box - Desktop */}
          <div className="hidden lg:flex items-center gap-2">
            {!isLoggedIn ? (
              <>
                <Link
                  to="/auth"
                  className="text-sm text-gray-700 font-medium hover:text-red-600"
                >
                  Log In
                </Link>
                <span className="text-gray-300">|</span>
                <Link
                  to="/register"
                  className="text-sm text-gray-700 font-medium hover:text-red-600"
                >
                  Register
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 font-semibold hover:underline"
              >
                Logout
              </button>
            )}
          </div>

          {/* Icons */}
          <div className="hidden sm:flex items-center gap-1 lg:gap-2">
            <IconButton className="!p-2 hover:bg-gray-100">
              <StyledBadge badgeContent={4} color="error">
                <IoIosGitCompare size={20} className="text-gray-600" />
              </StyledBadge>
            </IconButton>

            {/* ❤️ WISHLIST BUTTON - DYNAMIC COUNT */}
            <IconButton 
              className="!p-2 hover:bg-gray-100"
              onClick={handleWishlistClick}
              title={isLoggedIn ? "My Wishlist" : "Login to view wishlist"}
            >
              <StyledBadge badgeContent={wishlistCount} color="error" max={99}>
                {wishlistCount > 0 ? (
                  <FaHeart size={20} className="text-red-500" />
                ) : (
                  <FaRegHeart size={20} className="text-gray-600" />
                )}
              </StyledBadge>
            </IconButton>

            <IconButton className="!p-2 hover:bg-gray-100">
              <StyledBadge badgeContent={4} color="error">
                <MdShoppingCartCheckout size={20} className="text-gray-600" />
              </StyledBadge>
            </IconButton>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <IoClose size={20} /> : <GiHamburgerMenu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t px-4 py-4 space-y-4 shadow-lg">
          <Search />

          <div className="flex flex-col gap-2 text-sm border-t pt-3">
            {!isLoggedIn ? (
              <>
                <Link to="/auth" className="py-2 font-medium">
                  Log In / Register
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="py-2 text-red-600 font-semibold text-left"
              >
                Logout
              </button>
            )}

            <Link to="/contact" className="py-2 font-medium">
              Help Center
            </Link>
            
          </div>

          <div className="flex gap-4 border-t pt-3">
            <IconButton className="!p-2">
              <StyledBadge badgeContent={2} color="error">
                <IoIosGitCompare size={20} />
              </StyledBadge>
            </IconButton>

            {/* ❤️ MOBILE WISHLIST BUTTON - DYNAMIC COUNT */}
            <IconButton 
              className="!p-2"
              onClick={handleWishlistClick}
            >
              <StyledBadge badgeContent={wishlistCount} color="error" max={99}>
                {wishlistCount > 0 ? (
                  <FaHeart size={20} className="text-red-500" />
                ) : (
                  <FaRegHeart size={20} />
                )}
              </StyledBadge>
            </IconButton>

            <IconButton className="!p-2">
              <StyledBadge badgeContent={1} color="error">
                <MdShoppingCartCheckout size={20} />
              </StyledBadge>
            </IconButton>
          </div>
        </div>
      )}

      <Navigation />
    </header>
  );
};

export default Header;