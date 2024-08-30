import React from 'react';
import styled from 'styled-components';
import ProductCard from './ProductCard';

const List = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const ProductList = ({ products }) => {
  return (
    <List>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </List>
  );
};

export default ProductList;
