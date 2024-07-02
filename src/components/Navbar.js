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
  padding: 0 20px;
  height: 80px; /* Adjusted height */
  background-color: #FFFFFF;
  color: black;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const LeftContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled.img`
  height: 60px; /* Adjusted size */
`;

const CenterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60%;
`;

const RightContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px; /* Space between right container elements */
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
        <SlideMenu />
      </RightContainer>
    </NavbarContainer>
  );
};

export default Navbar;
