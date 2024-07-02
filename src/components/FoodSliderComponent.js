// src/components/FoodSliderComponent.js
import React from 'react';
import styled from 'styled-components';
import foodData from './foodData';

const FoodSliderContainer = styled.div`
  padding: 20px;
`;

const FoodItem = styled.div`
  display: inline-block;
  margin: 10px;
  text-align: center;
`;

const FoodImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
`;

const FoodName = styled.p`
  margin-top: 10px;
  font-weight: bold;
`;

const FoodSliderComponent = () => {
  const items = foodData.popularItems || [];

  return (
    <FoodSliderContainer>
      <h2>Popular Food Items</h2>
      {items.map((item) => (
        <FoodItem key={item.id}>
          <FoodImage src={item.image} alt={item.name} />
          <FoodName>{item.name}</FoodName>
        </FoodItem>
      ))}
    </FoodSliderContainer>
  );
};

export default FoodSliderComponent;
