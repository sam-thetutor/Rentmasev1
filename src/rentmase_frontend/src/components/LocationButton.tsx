import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiMapPin } from 'react-icons/fi'; // Import the location icon from react-icons
import { LocationType } from '../redux/types';
import { useDispatch } from 'react-redux';
import { setLocation } from '../redux/slices/app';
import { CountryData } from '../pages/airtime/types';

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
  height: 40px; /* Set a fixed height to maintain button size */

  &:hover {
    background-color: #f0f0f0;
    border-color: blue;
  }

  &:active {
    border-color: blue;
  }
`;

const Icon = styled(FiMapPin)`
  width: 24px;
  height: 24px;
  margin-right: 10px;
  fill: #00B5E2; /* Set the fill color to 00B5E2 */
`;

const LocationText = styled.span`
  font-size: 1rem;
  color: black;
  margin-right: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px; /* Ensure text doesn't make the button too wide */
`;

const LocationButton = () => {
  const dispatch = useDispatch();
  const [currentLocation, setCurrentLocation] = useState('Loading...');

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


  const processLocations = async (city : string, cntry : string, location : string) => {
    const response = await fetch("https://topups.reloadly.com/countries");
    const data = await response.json();
    const _country = data.find((country: CountryData) => country.name === cntry);
    if (_country) {
      const _location: LocationType = {
        city: city,
        country: cntry,
        fullLocation: location,
        isoName: _country.isoName,
      }
      dispatch(setLocation(_location));
      setCurrentLocation(location);
    } else {
      setCurrentLocation(location);
    }
   
  }

  return (
    <>
      <Button>
        <Icon />
        <LocationText>{currentLocation}</LocationText>
      </Button>
    </>
  );
};

export default LocationButton;
