import React, { useState } from 'react';
import styled from 'styled-components';
import Hero from '../components/Hero';
import CategoryGrid from '../components/CategoryGrid';
import SearchForm from '../components/SearchForm';
import PlaceList from '../components/PlaceList';
import placesData from '../data/places';

const HomeContainer = styled.div`
  padding: 20px;
  background-color: #f5f5f5;
  text-align: center;
`;

const HomeTitle = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 40px;
`;

const HomeDescription = styled.p`
  text-align: center;
  color: #555;
  margin-bottom: 40px;
`;

const Home = () => {
  const [places, setPlaces] = useState(placesData);
  const [filteredPlaces, setFilteredPlaces] = useState(placesData);

  const handleSearch = ({ location, startDate, endDate, guests }) => {
    const results = places.filter(
      (place) =>
        place.location.toLowerCase().includes(location.toLowerCase()) &&
        place.guests >= guests
    );
    setFilteredPlaces(results);
  };

  return (
    <HomeContainer>
      <Hero />
      <CategoryGrid />
      <HomeTitle>Welcome to RentMase</HomeTitle>
      <HomeDescription>Your one-stop solution for renting places.</HomeDescription>
      <SearchForm onSearch={handleSearch} />
      <PlaceList places={filteredPlaces} />
    </HomeContainer>
  );
};

export default Home;
