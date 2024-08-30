import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import CartButton from './CartButton';
import SignInButton from './SignInButton';
import SearchBar from './SearchBar';
import LocationButton from './LocationButton';
import SlideMenu from './SlideMenu';
import LoginModal from './LoginModal';
import { useAuth } from '../hooks/Context';

const NavbarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 80px;
  background-color: #FFFFFF;
  color: black;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
    padding: 10px;
  }
`;

const LeftContainer = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    justify-content: center;
    width: 100%;
    margin-bottom: 10px;
  }
`;

const Logo = styled.img`
  height: 60px;

  @media (max-width: 768px) {
    height: 50px;
  }
`;

const CenterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60%;

  @media (max-width: 768px) {
    width: 100%;
    margin-bottom: 10px;
    justify-content: space-around;
  }
`;

const RightContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;

  @media (max-width: 768px) {
    justify-content: center;
    width: 100%;
  }
`;


const Button = styled.button`
  background-color: #00B5E2;
  border: 1px solid #00B5E2;
  color: white;
  padding: 15px 20px;
  margin-left: 10px;
  cursor: pointer;
  border-radius: 15px; /* Rounded corners */
  font-size: 1rem; /* Increased font size */

  &:hover {
    background-color: white;
    color: black;
  }
`;

const LearderBorderLink = styled(Link)`
  padding: 15px 20px;
  margin-left: 10px;
  cursor: pointer;
  border-radius: 15px; /* Rounded corners */
  font-size: 1rem; /* Increased font size */
  text-decoration: none;
  color: black;
  }
`;

const Navbar = () => {
  const [openModal, setOpenModal] = useState(false);
  const {isAuthenticated, identity, logout} = useAuth();

  return (
    <NavbarContainer>
      <LeftContainer>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'black' }}>
          <Logo src="/images/Logo.svg" alt="Logo" />
        </Link>
      </LeftContainer>
      <CenterContainer>
        {/* <SearchBar /> */}
      </CenterContainer>
      <RightContainer>

        <LocationButton />
        <LearderBorderLink to="leaderboard">Leaderboard</LearderBorderLink>
        <Button
          onClick={isAuthenticated ? logout : () => setOpenModal(true)}
        >
          {isAuthenticated ? 'Logout' : 'Login'}
        </Button>
        <CartButton />
        <SlideMenu />
      </RightContainer>
      {openModal && <LoginModal {...{openModal, setOpenModal}}/>}
    </NavbarContainer>
  );
};

export default Navbar;
