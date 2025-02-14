import React, { useEffect, useState } from 'react';
import { Await, Link } from 'react-router-dom';
import styled from 'styled-components';
import CartButton from './CartButton';
import SignInButton from './SignInButton';
import { FiMapPin } from 'react-icons/fi'; // Import the location icon from react-icons
import { MdLocationOn } from 'react-icons/md';
import { FaLocationArrow } from 'react-icons/fa';
import { LocationType } from '../redux/types';
import { setCashback, setLocation, setLocationStatus, setTokenBalance } from '../redux/slices/app';
import { CountryData } from '../pages/airtime/types';
import LocationButton from './LocationButton';
import SlideMenu from './SlideMenu';
import LoginModal from './LoginModal';
import { useAuth } from '../hooks/Context';
//@ts-ignore
import { ConnectWallet } from "@nfid/identitykit/react"
import { useDispatch, useSelector } from 'react-redux';
import { setTokenLiveData } from '../redux/slices/app';
import { RootState } from '../redux/store';
import SignUpModal from './SignUpModal';
//@ts-ignore 
import icblast from '@infu/icblast';


const Navbar = () => {
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [openSignUpModal, setOpenSignUpModal] = useState(false);
  const { isAuthenticated, backendActor, user, tokenCanister, identity } = useAuth();
  const { location } = useSelector((state: RootState) => state.app);

  useEffect(() => {
    if (user && tokenCanister) {
      getBalance();
    }
  }, [user, tokenCanister]);

  useEffect(() => {
    if (isAuthenticated && !user && backendActor) {
      getUser()
    } else {
      setOpenSignUpModal(false);
    }
  }, [user, isAuthenticated, backendActor]);

  const getUser = async () => {
    const res = await backendActor.getUser()
    if ("ok" in res) {
      setOpenSignUpModal(false);
    } else {
      setOpenSignUpModal(true);
    }
  }

  const getBalance = async () => {
    const balance = await tokenCanister.icrc1_balance_of({
      owner: user.id,
      subaccount: []
    });
    dispatch(setTokenBalance({
      balance: Number(balance),
      principal: user.id.toString(),
    }));
  }

  useEffect(() => {
    if (location) {
      fethTokenPrice();
    }
  }, [location]);

  useEffect(() => {
    (async () => {
      if (backendActor) {
        const _cashback = await backendActor.getCashback();
        dispatch(setCashback(_cashback));
      }
    })();
  }, [backendActor]);


  const fethTokenPrice = async () => {
    const ic = icblast({ local: false })

    let ps = await ic("ggzvv-5qaaa-aaaag-qck7a-cai");
    let token_data = await ps.getAllTokens();

    let token = token_data.find(x => x.address == "ryjl3-tyaaa-aaaaa-aaaba-cai");

    // console.log("token", token);
    // const response = await fetch("https://api.dexscreener.com/latest/dex/pairs/icp/mnbr7-uiaaa-aaaam-adaaq-cai:ryjl3-tyaaa-aaaaa-aaaba-cai");
    // const data = await response.json();
    dispatch(setTokenLiveData(token));
  }

  const [currentLocation, setCurrentLocation] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`)
            .then((response) => response.json())
            .then((data) => {
              const { address } = data;
              const city = address.city || address.town || address.village || address.state_district || address.county || 'Unknown City';
              const country = address.country || 'Unknown Country';
              const location = `${city}, ${country}`;

              processLocations(city, country, location);
            })
            .catch((error) => {
              dispatch(setLocationStatus('Geolocation Error'));
              console.error("Geolocation Error:", error);
              setCurrentLocation(null);
            });
        },
        (error) => {
          dispatch(setLocationStatus('Denied'));
          console.error("Geolocation Error:", error);
          setCurrentLocation(null);
        }
      );
    } else {
      setCurrentLocation('Geolocation not supported');
    }
  }, []);


  const processLocations = async (city: string, cntry: string, location: string) => {
    const response = await fetch("https://topups.reloadly.com/countries");
    const data = await response.json();
    const _country = data.find((country: CountryData) => country.name === cntry);
    if (_country) {
      const _location: LocationType = {
        city: city,
        country: cntry,
        fullLocation: location,
        isoName: _country.isoName,
        currencyCode: _country.currencyCode,
      }
      dispatch(setLocation(_location));
      setCurrentLocation(location);
    } else {
      setLocationStatus("NotFound")
      setCurrentLocation(location);
    }
  }

  return (
    <NavbarContainer>
      {/* <ConnectWallet />; */}
      <LeftContainer>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'black' }}>
          <Logo src="/images/logoB.svg" alt="Logo" />
        </Link>
        {currentLocation && <StyledLocationButton>
          <LocationButton {...{ currentLocation }} />
        </StyledLocationButton>}
      </LeftContainer>
      <CenterContainer>
        <RentmaseText>rentmase</RentmaseText>
      </CenterContainer>

      <RightContainer>
        <LearderBorderLink to="leaderboard">Leaderboard</LearderBorderLink>
        {isAuthenticated ? (
          <>
            {user ? <SlideMenu /> : <ButtonLink
              onClick={() => setOpenSignUpModal(true)}
            >Sign Up</ButtonLink>}
          </>
        ) : (
          <Button onClick={() => setOpenModal(true)}>Login/Sign Up</Button>
        )}
      </RightContainer>
      {openModal && <LoginModal {...{ openModal, setOpenModal }} />}
      {openSignUpModal && <SignUpModal {...{ openSignUpModal, setOpenSignUpModal }} />}
    </NavbarContainer>
  );
};

export default Navbar;

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
    width: 40%;
    text-align: center;
  }
`;

const ButtonLink = styled.button`
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

