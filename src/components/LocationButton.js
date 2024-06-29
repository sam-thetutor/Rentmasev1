import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ReactComponent as LocationIcon } from '../images/location.svg'; // Adjust the path as necessary

const Button = styled.button`
  display: flex;
  align-items: center;
  border: 1px solid lightgrey;
  background-color: white;
  border-radius: 25px;
  padding: 10px 10px;
  margin-right: 30px; /* Add margin to separate it from the search bar */
  cursor: pointer;
  transition: border-color 0.3s ease, background-color 0.3s ease;

  &:hover {
    background-color: #f0f0f0;
    border-color: blue;
  }

  &:active {
    border-color: blue;
  }
`;

const Icon = styled(LocationIcon)`
  width: 24px;
  height: 24px;
  margin-right: 10px;
`;

const LocationText = styled.span`
  font-size: 1rem;
  color: black;
  margin-right: 10px;
`;

const LocationButton = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('Loading...');

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`)
            .then((response) => response.json())
            .then((data) => {
              const city = data.address.city || data.address.town || data.address.village;
              const country = data.address.country;
              setCurrentLocation(`${city}, ${country}`);
            })
            .catch((error) => {
              console.error(error);
              setCurrentLocation('Unable to retrieve location');
            });
        },
        (error) => {
          console.error(error);
          setCurrentLocation('Unable to retrieve location');
        }
      );
    } else {
      setCurrentLocation('Geolocation not supported');
    }
  }, []);

  const handleLocationChange = (newLocation) => {
    setCurrentLocation(newLocation);
    setModalOpen(false);
  };

  return (
    <>
      <Button onClick={toggleModal}>
        <Icon />
        <LocationText>{currentLocation}</LocationText>
      </Button>
      
    </>
  );
};

export default LocationButton;
