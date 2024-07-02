// src/pages/FoodDelivery.js
import React from 'react';
import styled from 'styled-components';
import SearchComponent from '../components/SearchComponent';
import InspirationComponent from '../components/InspirationComponent';
import FoodSliderComponent from '../components/FoodSliderComponent';
import Restaurants from './Restaurants'; // Import the Restaurants component

const FoodDeliveryContainer = styled.div`
  font-family: Arial, sans-serif;
  padding: 20px;
`;

function FoodDelivery() {
  return (
    <FoodDeliveryContainer>
      <SearchComponent />
      <InspirationComponent />
      <Restaurants /> {/* Add the Restaurants component here */}
     
    </FoodDeliveryContainer>
  );
}

export default FoodDelivery;
