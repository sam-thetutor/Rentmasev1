import React, { useState } from 'react';
import styled from 'styled-components';
import FoodCarousel from './FoodCarousel';
import TravelCarousel from './TravelCarousel';
import RetailCarousel from './RetailCarousel';

const GridContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const ProductsGrid = () => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  return (
    <GridContainer>
      <FoodCarousel addToCart={addToCart} />
      <TravelCarousel addToCart={addToCart} />
      <RetailCarousel addToCart={addToCart} />
      {/* You can display the cart content here or in another component */}
    </GridContainer>
  );
};

export default ProductsGrid;
