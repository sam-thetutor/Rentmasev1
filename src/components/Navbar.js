import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import CartButton from './CartButton';
import SignInButton from './SignInButton';
import SearchBar from './SearchBar';
import LocationButton from './LocationButton';
import SlideMenu from './SlideMenu';

const NavbarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 140px;
  height: 100px; /* Adjusted height to fit larger logo */
  background-color: #D3D3D3;
  color: black;
`;

const LeftContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled.img`
  height: 70px; /* Adjusted size to fit within navbar */
  margin-left: 120px;
`;

const CenterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start; /* Align items to the start */
  width: 60%; /* Increase the width of the center container */
  margin-left: 20px; /* Added margin to move the logo to the right */
`;

const RightContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Navbar = () => {
  return (
    <NavbarContainer>
      <LeftContainer>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'black' }}>
          <Logo src="/images/Logo.svg" alt="Logo" />
        </Link>
      </LeftContainer>
      <CenterContainer>
        <LocationButton />
        <SearchBar />
      </CenterContainer>
      <RightContainer>
        <SignInButton />
        <CartButton />
        <SlideMenu /> {/* Add SlideMenu here */}
      </RightContainer>
    </NavbarContainer>
  );
};

export default Navbar;
