import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaUser, FaTags, FaHistory, FaCreditCard, FaMoneyBill, FaHeart, FaUserFriends, FaSignOutAlt } from 'react-icons/fa';

const MenuButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 24px;
`;

const MenuContainer = styled.div`
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
    color: blue;
  }

  svg {
    margin-right: 10px;
  }
`;

const Overlay = styled.div`
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
          </li>
          <li>
            <MenuItem to="/invite-friends">
              <FaUserFriends /> Invite Friends
            </MenuItem>
          </li>
          <li>
            <MenuItem to="/logout">
              <FaSignOutAlt /> Logout
            </MenuItem>
          </li>
        </MenuList>
      </MenuContainer>
    </>
  );
};

export default SlideMenu;
