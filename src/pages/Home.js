import React, { useState } from 'react';
import styled from 'styled-components';
import Hero from '../components/Hero'; // Adjust the import path if necessary
import CategoryGrid from '../components/CategoryGrid'; // Adjust the import path if necessary
import RestaurantCarousel from '../components/RestaurantCarousel';
import FoodItemsCarousel from '../components/FoodItemsCarousel';

const HomeContainer = styled.div`
  padding: 20px;
  background-color: #f5f5f5;
  text-align: center; /* Center the text */
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
  const [cart, setCart] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  const addToCart = (product) => {
    setCart([...cart, product]);
    console.log('Cart items:', cart);
  };

  const handleSelectRestaurant = (restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  return (
    <HomeContainer>
      <Hero />
      <CategoryGrid />
      <HomeTitle>Welcome to RentMase</HomeTitle>
      <HomeDescription>Your one-stop solution for buying products, renting places, and ordering food.</HomeDescription>
      {selectedRestaurant ? (
        <FoodItemsCarousel restaurant={selectedRestaurant} addToCart={addToCart} />
      ) : (
        <RestaurantCarousel onSelectRestaurant={handleSelectRestaurant} />
      )}
    </HomeContainer>
  );
};

export default Home;