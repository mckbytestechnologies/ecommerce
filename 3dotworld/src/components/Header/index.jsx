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
import { FaRegHeart, FaHeart, FaUser, FaMapMarkerAlt, FaChevronDown } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { cartApi } from "../../utils/cartApi";

// MUI Components for Dropdown
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";

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
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  
  // Profile & Address states
  const [userProfile, setUserProfile] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  
  // Dropdown states
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [addressAnchorEl, setAddressAnchorEl] = useState(null);
  
  const profileOpen = Boolean(profileAnchorEl);
  const addressOpen = Boolean(addressAnchorEl);

  // Get auth token
  const getToken = () => {
    return localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
  };

  // Fetch user profile
  const fetchUserProfile = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await axios.get("http://localhost:5000/api/auth/me", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setUserProfile(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  // Fetch user addresses
  const fetchUserAddresses = async () => {
    try {
      const token = getToken();
      if (!token) return;

      setLoadingAddresses(true);
      const response = await axios.get("http://localhost:5000/api/addresses", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        const userAddresses = response.data.data || [];
        setAddresses(userAddresses);
        
        // Find default address
        const defaultAddr = userAddresses.find(addr => addr.is_default === true);
        setDefaultAddress(defaultAddr || (userAddresses.length > 0 ? userAddresses[0] : null));
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setLoadingAddresses(false);
    }
  };

  // Set default address
  const setAsDefaultAddress = async (addressId) => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await axios.put(
        `http://localhost:5000/api/addresses/${addressId}/set-default`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        // Refresh addresses
        fetchUserAddresses();
      }
    } catch (error) {
      console.error("Error setting default address:", error);
    }
  };

  // Fetch cart count
  const fetchCartCount = async () => {
    try {
      const token = getToken();
      
      if (!token) {
        setCartCount(0);
        return;
      }

      setCartLoading(true);
      const response = await cartApi.getCart();
      
      if (response.success) {
        const count = response.data?.items?.length || 0;
        setCartCount(count);
      }
    } catch (error) {
      console.error("Error fetching cart count:", error);
      if (error.response?.status === 401 || error.message?.includes('Unauthorized')) {
        setCartCount(0);
      }
    } finally {
      setCartLoading(false);
    }
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
      if (error.response?.status === 401) {
        setWishlistCount(0);
      }
    }
  };

  // Initialize user data
  useEffect(() => {
    const token = getToken();
    const loggedIn = !!token;
    setIsLoggedIn(loggedIn);

    if (loggedIn) {
      fetchUserProfile();
      fetchUserAddresses();
      fetchCartCount();
      fetchWishlistCount();
    } else {
      setCartCount(0);
      setWishlistCount(0);
      setUserProfile(null);
      setAddresses([]);
      setDefaultAddress(null);
    }

    // Event listeners
    const handleCartUpdate = () => {
      if (loggedIn) {
        fetchCartCount();
      }
    };

    const handleAddressUpdate = () => {
      if (loggedIn) {
        fetchUserAddresses();
      }
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('addressUpdated', handleAddressUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('addressUpdated', handleAddressUpdate);
    };
  }, []);

  // Listen for wishlist updates
  useEffect(() => {
    const handleWishlistUpdate = () => {
      if (isLoggedIn) {
        fetchWishlistCount();
      }
    };

    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    
    return () => {
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
    };
  }, [isLoggedIn]);

  // Profile dropdown handlers
  const handleProfileClick = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };

  // Address dropdown handlers
  const handleAddressClick = (event) => {
    setAddressAnchorEl(event.currentTarget);
  };

  const handleAddressClose = () => {
    setAddressAnchorEl(null);
  };

  // Handle cart icon click
  const handleCartClick = () => {
    if (isLoggedIn) {
      navigate("/cart");
    } else {
      navigate("/auth");
    }
  };

  // Handle wishlist click
  const handleWishlistClick = () => {
    if (isLoggedIn) {
      navigate("/wishlist");
    } else {
      navigate("/auth");
    }
  };

  // Handle compare click
  const handleCompareClick = () => {
    navigate("/compare");
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    setIsLoggedIn(false);
    setUserProfile(null);
    setAddresses([]);
    setDefaultAddress(null);
    setWishlistCount(0);
    setCartCount(0);
    handleProfileClose();
    navigate("/auth");
  };

  // Format address for display
  const formatAddress = (address) => {
    if (!address) return "Select Address";
    
    const parts = [
      address.name,
      address.address_line,
      address.city,
      address.state,
      address.pincode
    ].filter(part => part && part.trim() !== "");
    
    return parts.join(", ");
  };

  // Get initials for avatar
  const getUserInitials = () => {
    if (!userProfile?.name) return "U";
    return userProfile.name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="bg-white w-full border-b border-gray-200 top-0 z-50 sticky">
      {/* Top Strip */}
      <div className="top-strip py-2 bg-gradient-to-r from-gray-50 to-gray-100 w-full hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6">
          <p className="text-[13px] font-medium text-gray-700">
            🎉 Get Up To 50% off new season styles, limited time only
          </p>

          <ul className="flex items-center gap-5 text-gray-700 text-sm">
            <li>
              <Link to="/help-center" className="hover:underline hover:text-gray-900">
                Help Center
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
          <div className="hidden lg:flex items-center gap-4">
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
              <>
                {/* User Profile Dropdown */}
                <Tooltip title="My Account">
                  <IconButton
                    onClick={handleProfileClick}
                    className="!p-1 hover:bg-gray-100"
                    size="small"
                  >
                    {userProfile?.profilePicture ? (
                      <img
                        src={userProfile.profilePicture}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover border"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                        {getUserInitials()}
                      </div>
                    )}
                  </IconButton>
                </Tooltip>

                {/* Profile Menu */}
                <Menu
                  anchorEl={profileAnchorEl}
                  open={profileOpen}
                  onClose={handleProfileClose}
                  PaperProps={{
                    style: {
                      width: 250,
                    },
                  }}
                >
                  <div className="p-3 border-b">
                    <Typography variant="subtitle1" className="font-semibold">
                      {userProfile?.name || "User"}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {userProfile?.email || ""}
                    </Typography>
                  </div>

                  <MenuItem 
                    onClick={() => {
                      navigate("/profile");
                      handleProfileClose();
                    }}
                  >
                    <ListItemIcon>
                      <FaUser size={18} />
                    </ListItemIcon>
                    <Typography variant="body2">My Profile</Typography>
                  </MenuItem>

                  <MenuItem 
                    onClick={() => {
                      navigate("/profile/orders");
                      handleProfileClose();
                    }}
                  >
                    <ListItemIcon>
                      <MdShoppingCartCheckout size={18} />
                    </ListItemIcon>
                    <Typography variant="body2">My Orders</Typography>
                  </MenuItem>

                  <MenuItem 
                    onClick={() => {
                      navigate("/profile/addresses");
                      handleProfileClose();
                    }}
                  >
                    <ListItemIcon>
                      <FaMapMarkerAlt size={18} />
                    </ListItemIcon>
                    <Typography variant="body2">My Addresses</Typography>
                  </MenuItem>

                  <Divider />

                  <MenuItem onClick={handleLogout}>
                    <Typography variant="body2" color="error" className="font-medium">
                      Logout
                    </Typography>
                  </MenuItem>
                </Menu>
              </>
            )}
          </div>

          {/* Icons */}
          <div className="hidden sm:flex items-center gap-1 lg:gap-2">
            {/* ❤️ WISHLIST BUTTON */}
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

            {/* 🛒 CART BUTTON */}
            <IconButton 
              className="!p-2 hover:bg-gray-100 relative"
              onClick={handleCartClick}
              title={isLoggedIn ? "My Cart" : "Login to view cart"}
              disabled={cartLoading}
            >
              {cartLoading ? (
                <CircularProgress size={20} />
              ) : (
                <>
                  <StyledBadge badgeContent={cartCount} color="error" max={99}>
                    <MdShoppingCartCheckout size={20} className="text-gray-600" />
                  </StyledBadge>
                  {cartCount > 0 && (
                    <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                  )}
                </>
              )}
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
          {/* Mobile Delivery Address - If logged in */}
          {isLoggedIn && defaultAddress && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-start gap-2">
                <FaMapMarkerAlt className="text-red-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-xs text-gray-500">Delivering to</div>
                  <div className="text-sm font-medium">
                    {defaultAddress.name} • {defaultAddress.city}
                  </div>
                  <div className="text-xs text-gray-600 mt-1 truncate">
                    {defaultAddress.address_line}
                  </div>
                  <Button
                    size="small"
                    className="!mt-2 !text-xs"
                    onClick={() => {
                      navigate("/profile/addresses");
                      setMobileMenuOpen(false);
                    }}
                  >
                    Change Address
                  </Button>
                </div>
              </div>
            </div>
          )}

          <Search />

          <div className="flex flex-col gap-2 text-sm border-t pt-3">
            {!isLoggedIn ? (
              <>
                <Link 
                  to="/auth" 
                  className="py-2 font-medium hover:text-red-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log In / Register
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/profile" 
                  className="py-2 font-medium hover:text-red-600 flex items-center gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FaUser />
                  My Profile
                </Link>
                <Link 
                  to="/profile/orders" 
                  className="py-2 font-medium hover:text-red-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Orders
                </Link>
                <Link 
                  to="/profile/addresses" 
                  className="py-2 font-medium hover:text-red-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Addresses
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="py-2 text-red-600 font-semibold text-left"
                >
                  Logout
                </button>
              </>
            )}

            <Link 
              to="/help-center" 
              className="py-2 font-medium hover:text-red-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Help Center
            </Link>
          </div>

          <div className="flex gap-4 border-t pt-3 justify-center">
            {/* Mobile Wishlist Button */}
            <IconButton 
              className="!p-2"
              onClick={() => {
                handleWishlistClick();
                setMobileMenuOpen(false);
              }}
            >
              <StyledBadge badgeContent={wishlistCount} color="error" max={99}>
                {wishlistCount > 0 ? (
                  <FaHeart size={20} className="text-red-500" />
                ) : (
                  <FaRegHeart size={20} />
                )}
              </StyledBadge>
            </IconButton>

            {/* Mobile Cart Button */}
            <IconButton 
              className="!p-2"
              onClick={() => {
                handleCartClick();
                setMobileMenuOpen(false);
              }}
              disabled={cartLoading}
            >
              {cartLoading ? (
                <CircularProgress size={20} />
              ) : (
                <StyledBadge badgeContent={cartCount} color="error" max={99}>
                  <MdShoppingCartCheckout size={20} />
                </StyledBadge>
              )}
            </IconButton>
          </div>
        </div>
      )}

      <Navigation />
    </header>
  );
};

export default Header;