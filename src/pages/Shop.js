import React, { useState } from 'react';
import styled from 'styled-components';
import ProductList from '../components/ProductList';
import shopData from '../data/shopData';

const ShopContainer = styled.div`
  padding: 20px;
  background-color: #f5f5f5;
  text-align: center;
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
