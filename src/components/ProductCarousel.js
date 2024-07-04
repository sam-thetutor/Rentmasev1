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
  overflow-x: hidden;
  scroll-behavior: smooth;
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
    outline: 2px solid #00B5E2;
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
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (listRef.current) {
      setWidth(listRef.current.offsetWidth);
    }
    const handleResize = () => {
      if (listRef.current) {
        setWidth(listRef.current.offsetWidth);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [listRef]);

  const toggleFavorite = (productId) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(productId)
        ? prevFavorites.filter((id) => id !== productId)
        : [...prevFavorites, productId]
    );
  };

  const scrollLeft = () => {
    if (listRef.current) {
      listRef.current.scrollBy({ left: -width, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (listRef.current) {
      listRef.current.scrollBy({ left: width, behavior: 'smooth' });
    }
  };

  return (
    <CarouselContainer>
      <ArrowButton onClick={scrollLeft}>
        <FaChevronLeft />
      </ArrowButton>
      <List ref={listRef}>
        {shopData.products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            toggleFavorite={toggleFavorite}
            isFavorite={favorites.includes(product.id)}
          />
        ))}
      </List>
      <ArrowButton onClick={scrollRight}>
        <FaChevronRight />
      </ArrowButton>
    </CarouselContainer>
  );
};

export default ProductCarousel;
