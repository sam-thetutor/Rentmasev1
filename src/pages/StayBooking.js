import React, { useState } from 'react';
import styled from 'styled-components';
import SearchForm from '../components/SearchForm'; // Adjust the import path according to your project structure
import placesData from '../data/places'; // Adjust the import path according to your project structure
import PlaceGrid from '../components/PlaceGrid';

const Container = styled.div`
  padding: 20px;
`;

const StayBooking = () => {
  const [filteredPlaces, setFilteredPlaces] = useState(placesData);

  const handleSearch = ({ location, startDate, endDate, guests }) => {
    const filtered = placesData.filter(place => {
      return (
        place.location.toLowerCase().includes(location.toLowerCase()) &&
        place.guests >= guests
      );
    });
    setFilteredPlaces(filtered);
  };

  return (
    <Container>
      <SearchForm onSearch={handleSearch} />
      <PlaceGrid places={filteredPlaces} />
    </Container>
  );
};

export default StayBooking;
