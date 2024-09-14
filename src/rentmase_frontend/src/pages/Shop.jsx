import React, { useState } from 'react';
import styled from 'styled-components';
import ProductList from '../components/ProductList';
import shopData from '../data/shopData';

const ShopContainer = styled.div`
  padding: 20px;
  background-color: transparent;
  text-align: center;

  h1 {
    color: #008DD5; /* Blue color */
    font-family: 'Poppins', sans-serif; /* Poppins font */
    font-size: 32px; /* Adjust font size as needed */
    font-weight: bold; /* Make the text bold */
    margin-bottom: 20px; /* Add spacing below the title */
  }
`;

const Shop = () => {
  const [products] = useState(shopData.products);

  return (
    <ShopContainer>
      <h1>Shop</h1>
      <ProductList products={products} />
    </ShopContainer>
  );
};

export default Shop;
