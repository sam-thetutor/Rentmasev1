import React, { useState } from 'react';
import styled from 'styled-components';
import Hero from '../components/Hero';
import CategoryGrid from '../components/CategoryGrid';
import SearchForm from '../components/SearchForm';
import PlaceList from '../components/PlaceList';
import placesData from '../data/places';
import InspirationComponent from '../components/InspirationComponent';

import RestaurantCarousel from './RestaurantCarousel';
import ProductCarousel from '../components/ProductCarousel';

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
       <CategoryGrid />
      <Hero />
     
      <HomeTitle>Welcome to RentMase</HomeTitle>
      <HomeDescription>The Ultimate SuperApp for everyhing you need</HomeDescription>
      {/* <SearchForm onSearch={handleSearch} /> */}
      <h2>Find your next HOME</h2>
      <PlaceList places={filteredPlaces} />

      <InspirationComponent />
      <h2>Restaurants near you.</h2>
      <RestaurantCarousel /> {/* Add the Restaurants component here */}

      <h2>Products delivered to your doorstep.</h2>
      <ProductCarousel/>
    </HomeContainer>
  );
};

export default Home;
