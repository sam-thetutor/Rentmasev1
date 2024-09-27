import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import CartButton from './CartButton';
import SignInButton from './SignInButton';
import LocationButton from './LocationButton';
import SlideMenu from './SlideMenu';
import LoginModal from './LoginModal';
import { useAuth } from '../hooks/Context';
import { ConnectWallet } from "@nfid/identitykit/react"

const NavbarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 80px;
  background-color: transparent;
  color: black;
  font-family: 'Poppins', sans-serif;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    height: auto;
    padding: 10px 0;
  }
`;

const LeftContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;

  @media (max-width: 768px) {
    justify-content: center;
    width: 100%;
    gap: 10px;
    margin-bottom: 10px;
  }
`;

const Logo = styled.img`
  height: 60px;

  @media (max-width: 768px) {
    height: 50px;
  }
`;

// Ensure that the location button disappears below 768px
const StyledLocationButton = styled.div`
  display: block;

  @media (max-width: 768px) {
    display: none;
  }
`;

const CenterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-family: 'Poppins', sans-serif;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    position: static;
    transform: none;
    margin-bottom: 10px;
  }
`;

const RentmaseText = styled.h1`
  font-size: 1.5rem;
  color: #008DD5;
  margin: 0;
  font-family: 'Poppins', sans-serif;

  @media (max-width: 768px) {
    font-size: 1.2rem;
    text-align: center;
  }
`;

const RightContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  font-family: 'Poppins', sans-serif;

  @media (max-width: 768px) {
    justify-content: center;
    flex-wrap: wrap;
    width: 100%;
    gap: 10px;
  }
`;

const Button = styled.button`
  background-color: #008DD5;
  border: none;
  color: white;
  padding: 10px 25px;
  margin-left: 10px;
  cursor: pointer;
  border: 2px solid #008DD5;
  border-radius: 30px;
  font-size: 1rem;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: white;
    color: #008DD5;
    border-color: #008DD5;
  }

  @media (max-width: 768px) {
    width: 20%;
    text-align: center;
  }
`;

const ButtonLink = styled(Link)`
  background-color: #008DD5;
  border: none;
  color: white;
  padding: 10px 25px;
  margin-left: 10px;
  cursor: pointer;
  border: 2px solid #008DD5;
  border-radius: 30px;
  font-size: 1rem;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: white;
    color: #008DD5;
    border-color: #008DD5;
  }

  @media (max-width: 768px) {
    width: 20%;
    text-align: center;
  }
`;


const LearderBorderLink = styled(Link)`
  padding: 10px 20px;
  margin-left: 10px;
  cursor: pointer;
  border-radius: 30px;
  font-size: 1rem;
  text-decoration: none;
  color: white;
  background-color: #008DD5;
  border: 2px solid #008DD5;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    background-color: white;
    color: #008DD5;
    border-color: #008DD5;
  }

  @media (max-width: 768px) {
    width: 30%;
    text-align: center;
    margin-left: 0;
  }
`;

const Navbar = () => {
  const [openModal, setOpenModal] = useState(false);
  const { isAuthenticated, user } = useAuth();

  return (
    <NavbarContainer>
         <ConnectWallet />;
      <LeftContainer>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'black' }}>
          <Logo src="/images/logoB.svg" alt="Logo" />
        </Link>
        <StyledLocationButton>
          <LocationButton />
        </StyledLocationButton>
      </LeftContainer>
      <CenterContainer>
        <RentmaseText>rentmase</RentmaseText>
      </CenterContainer>
   
      <RightContainer>
        <LearderBorderLink to="leaderboard">Leaderboard</LearderBorderLink>
        {isAuthenticated ? (
          <>
          {user ? <SlideMenu /> : <ButtonLink to="/signup">Sign Up</ButtonLink>}
          </>
        ) : (
          <Button onClick={() => setOpenModal(true)}>Login</Button>
        )}
      </RightContainer>
      {openModal && <LoginModal {...{ openModal, setOpenModal }} />}
    </NavbarContainer>
  );
};

export default Navbar;
