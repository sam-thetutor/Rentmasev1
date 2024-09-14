import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import ProductCard from './ProductCard'; // Ensure the path is correct
import shopData from '../data/shopData'; // Ensure the path is correct

const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  padding: 20px 0;
`;

const List = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 20px;
  padding-left: 60px; /* Adjust left padding to show the first item */
  padding-right: 60px; /* Adjust right padding to show the last item */
  scroll-behavior: smooth;
  overflow-x: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const ItemWrapper = styled.div`
  min-width: 220px;
  flex-shrink: 0;
  transition: transform 0.3s ease-in-out;
`;

const ArrowButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  padding: 10px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;

  &:hover {
    background-color: rgba(0, 0, 0, 0.7);
    outline: 2px solid #008DD5;
  }

  &:first-of-type {
    left: 10px;
  }

  &:last-of-type {
    right: 10px;
  }
`;

const ProductCarousel = () => {
  const [favorites, setFavorites] = useState([]);
  const listRef = useRef(null);
  const itemWidth = 350; // Set a fixed width for each product item

  const toggleFavorite = (productId) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(productId)
        ? prevFavorites.filter((id) => id !== productId)
        : [...prevFavorites, productId]
    );
  };

  const scrollLeft = () => {
    listRef.current.scrollBy({ left: -itemWidth, behavior: 'smooth' });
  };

  const scrollRight = () => {
    listRef.current.scrollBy({ left: itemWidth, behavior: 'smooth' });
  };

  return (
    <CarouselContainer>
      <ArrowButton onClick={scrollLeft}>
        <FaChevronLeft />
      </ArrowButton>
      <List ref={listRef}>
        {shopData.products.map((product) => (
          <ItemWrapper key={product.id}>
            <ProductCard
              product={product}
              toggleFavorite={toggleFavorite}
              isFavorite={favorites.includes(product.id)}
            />
          </ItemWrapper>
        ))}
      </List>
      <ArrowButton onClick={scrollRight}>
        <FaChevronRight />
      </ArrowButton>
    </CarouselContainer>
  );
};

export default ProductCarousel;
