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
  padding: 40px 20px;
  background-color: transparet;
  text-align: center;
  font-family: 'Poppins', sans-serif; /* Apply Poppins globally */
`;

const HomeTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 400;
  color: #111827;
  margin-bottom: 20px;
`;

const HomeDescription = styled.p`
  font-size: 1.125rem;
  color: #6B7280; /* Text color for description */
  margin-bottom: 0px;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 500;
  margin-top: 60px;
  margin-bottom: 30px;
  color: #111827;
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
      <HomeDescription>
        Welcome to RentMase.
      </HomeDescription>
      <HomeTitle>World's First Fully Decentralized SuperApp</HomeTitle>
      
      
      {/* Optionally enable the search form */}
      {/* <SearchForm onSearch={handleSearch} /> */}
      
      <SectionTitle>Find your next HOME</SectionTitle>
      <PlaceList places={filteredPlaces} />

      <InspirationComponent />
      
      <SectionTitle>Restaurants near you</SectionTitle>
      <RestaurantCarousel />

      <SectionTitle>Products delivered to your doorstep</SectionTitle>
      <ProductCarousel />
    </HomeContainer>
  );
};

export default Home;
