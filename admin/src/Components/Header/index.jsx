import React from 'react';
import Button from '@mui/material/Button';
import { RiMenu2Line } from "react-icons/ri";
import Badge from '@mui/material/Badge';
import { FaRegBell } from "react-icons/fa6";
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import { PersonAdd, Settings, Logout } from '@mui/icons-material';
import Avatar from '@mui/material/Avatar';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
    padding: '0 4px',
  },
}));

const Header = () => {
  const [anchorMyAcc, setAnchorMyAcc] = React.useState(null);
  const open = Boolean(anchorMyAcc);

  const handleClick = (event) => {
    setAnchorMyAcc(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorMyAcc(null);
  };

  return (
    <header className="w-full h-[50px] pl-64 pr-7 bg-gray-200  flex items-center justify-between">
      {/* Left Part */}
      <div className='part1'>
            <Button className='!w-[40px] !h-[40px] !rounded-full  !min-w-[40px]'><RiMenu2Line className='text-[22px] text-[rgba(0,0,0,0.8)]' /></Button>

        </div>

      {/* Right Part */}
      <div className="part-2 flex items-center justify-end gap-3">
        {/* Notifications */}
        <IconButton aria-label="notifications">
          <StyledBadge badgeContent={4} color="secondary">
            <FaRegBell className="text-[22px]" />
          </StyledBadge>
        </IconButton>

        {/* Profile Picture */}
        <div
          className="rounded-full w-[30px] h-[30px] overflow-hidden cursor-pointer"
          onClick={handleClick}
        >
          <img
            src="https://i.pinimg.com/736x/65/74/9e/65749e1d2b9201b7a299b4370b3d01ca.jpg"
            alt="profile"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Menu */}
        <Menu
          anchorEl={anchorMyAcc}
          open={open}
          onClose={handleClose}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        >
          <MenuItem onClick={handleClose}>
            <Avatar sx={{ width: 24, height: 24, mr: 1 }} /> Profile
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <Avatar sx={{ width: 24, height: 24, mr: 1 }} /> My account
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <PersonAdd fontSize="small" />
            </ListItemIcon>
            Add another account
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            Settings
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </div>
    </header>
  );
};

export default Header;
