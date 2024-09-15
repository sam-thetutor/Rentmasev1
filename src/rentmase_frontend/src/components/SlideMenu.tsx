// src/components/SlideMenu.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaUser, FaTags, FaHistory, FaCreditCard, FaMoneyBill,FaShoppingCart, FaHeart, FaUserFriends, FaSignOutAlt, FaUtensils, FaHome, FaBed } from 'react-icons/fa';
import { useAuth } from '../hooks/Context';

interface OverlayProps {
  open: boolean;
}

const MenuButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 24px;
`;

const MenuContainer = styled.div<OverlayProps>`
  position: fixed;
  top: 0;
  right: 0;
  width: 250px;
  height: 100%;
  background-color: white;
  overflow-x: hidden;
  transform: ${(props) => (props.open ? 'translateX(0)' : 'translateX(100%)')};
  transition: transform 0.3s ease-in-out;
  box-shadow: ${(props) => (props.open ? '-2px 0 5px rgba(0,0,0,0.5)' : 'none')};
  z-index: 2; /* Increased z-index to be above overlay */
  padding-top: 60px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 25px;
  font-size: 36px;
  background: none;
  border: none;
  cursor: pointer;
`;

const MenuList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const MenuItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  text-decoration: none;
  font-size: 18px;
  color: black;
  transition: color 0.3s;

  &:hover {
    color: #008DD5;
  }

  svg {
    margin-right: 10px;
    color: #008DD5; /* Change the icon color here */
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  text-decoration: none;
  font-size: 18px;
  color: black;
  transition: color 0.3s;
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    color: #008DD5;
  }

  svg {
    margin-right: 10px;
    color: #008DD5; /* Change the icon color here */
  }
`;

const Overlay = styled.div<OverlayProps>`
  display: ${(props) => (props.open ? 'block' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;
`;

const SlideMenu = () => {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();

  const toggleMenu = () => {
    setOpen(!open);
  };

  return (
    <>
      <MenuButton onClick={toggleMenu}>☰</MenuButton>
      <Overlay open={open} onClick={toggleMenu} />
      <MenuContainer open={open}>
        <CloseButton onClick={toggleMenu}>&times;</CloseButton>
        <MenuList>
          <li>
            <MenuItem to="/profile">
              <FaUser /> Profile
            </MenuItem>
          </li>
          <li>
            <MenuItem to="/invite-friends">
              <FaUserFriends /> Invite Friends
            </MenuItem>
          </li>
          <li>
            <MenuItem to="/purchases-history">
              <FaShoppingCart /> Payment History
            </MenuItem>
          </li>
          {/* <li>
            <MenuItem to="/my-deals">
              <FaTags /> My Deals
            </MenuItem>
          </li>
          <li>
            <MenuItem to="/payment-history">
              <FaHistory /> Payment History
            </MenuItem>
          </li>
          <li>
            <MenuItem to="/payment-methods">
              <FaCreditCard /> Payment Methods
            </MenuItem>
          </li>
          <li>
            <MenuItem to="/my-cashback">
              <FaMoneyBill /> My Cashback
            </MenuItem>
          </li>
          <li>
            <MenuItem to="/my-faves">
              <FaHeart /> My Faves
            </MenuItem>
          </li> */}
          
          <li>
            <MenuItem to="/travel-bookings">
              <FaBed /> Rentals
            </MenuItem>
          </li>
          <li>
            <MenuItem to="/deliveries">
              <FaUtensils /> Deliveries
            </MenuItem>
          </li>
          <li>
            <MenuItem to="/manage-addresses">
              <FaHome /> Manage Addresses
            </MenuItem>
          </li>
          <li>
            <LogoutButton 
              onClick={logout}
            >
              <FaSignOutAlt /> Logout
            </LogoutButton>
          </li>
        </MenuList>
      </MenuContainer>
    </>
  );
};

export default SlideMenu;
