import React, { useRef } from 'react';
import styled from 'styled-components';
import PlaceCard from './PlaceCard';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  padding: 20px 0;
`;

const List = styled.div`
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    display: none;
  }
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

const PlaceList = ({ places }) => {
  const listRef = useRef(null);

  const scrollLeft = () => {
    listRef.current.scrollBy({ left: -500, behavior: 'smooth' });
  };

  const scrollRight = () => {
    listRef.current.scrollBy({ left: 500, behavior: 'smooth' });
  };

  return (
    <CarouselContainer>
      <ArrowButton onClick={scrollLeft}>
        <FaChevronLeft />
      </ArrowButton>
      <List ref={listRef}>
        {places.map((place) => (
          <PlaceCard key={place.id} place={place} />
        ))}
      </List>
      <ArrowButton onClick={scrollRight}>
        <FaChevronRight />
      </ArrowButton>
    </CarouselContainer>
  );
};

export default PlaceList;
