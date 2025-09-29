import React from 'react';
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import Search from "../Search";
import Navigation from "./Navigation";
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { MdShoppingCartCheckout } from "react-icons/md";
import { IoIosGitCompare } from "react-icons/io";
import { FaRegHeart } from "react-icons/fa";

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ₹{(theme.vars ?? theme).palette.background.paper}`,
    padding: '0 4px',
  },
}));

const Header = () => {
  return (
    <header className="bg-white w-full">
  {/* Top Strip */}
  <div className="top-strip py-2 bg-primary w-full">
    <div className="flex items-center justify-between px-6">
      <div className="col1 w-1/2">
        <p className="text-[14px] font-[500]">
          Get Up To 50% off new season styles, limited time only
        </p>
      </div>
      <div className="col2 flex items-center justify-end">
        <ul className="flex items-center gap-5">
          <li>
            <Link to="/help-center" className="text-black no-underline transition link">
              Help Center
            </Link>
          </li>
          <li>
            <Link to="/order-tracking" className="text-black no-underline transition link">
              Order Tracking
            </Link>
          </li>
        </ul>
      </div>
    </div>
  </div>

  {/* Main Header */}
  <div className="top-strip header py-5 w-full">
    <div className="flex items-center justify-between px-6">
      {/* Logo */}
      <div className="w-1/4">
        <Link to={"/"}>
          <img src="/logo.jpg" alt="Logo" className="w-14 h-auto" />
        </Link>
      </div>

      {/* Search Bar */}
      <div className="flex-1 px-6">
        <Search />
      </div>

      {/* Right Section */}
      <div className="w-1/4 flex justify-end">
        <ul className="flex items-center gap-3">
          <li>
            <Link to="/login" className="link text-black font-[500]">
              Log In
            </Link>{" "}
            | &nbsp;
            <Link to="/register" className="link text-black font-[500]">
              Register
            </Link>
          </li>
          <li>
            <IconButton aria-label="compare">
              <StyledBadge badgeContent={4} color="secondary">
                <IoIosGitCompare size={24} />
              </StyledBadge>
            </IconButton>
          </li>
          <li>
            <IconButton aria-label="wishlist">
              <StyledBadge badgeContent={4} color="secondary">
                <FaRegHeart size={24} />
              </StyledBadge>
            </IconButton>
          </li>
          <li>
            <IconButton aria-label="cart">
              <StyledBadge badgeContent={4} color="secondary">
                <MdShoppingCartCheckout size={24} />
              </StyledBadge>
            </IconButton>
          </li>
        </ul>
      </div>
    </div>
  </div>

  <Navigation />
</header>

  )
}

export default Header;
