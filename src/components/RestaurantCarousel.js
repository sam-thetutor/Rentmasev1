import React, { useState } from 'react';
import Slider from 'react-slick';
import styled from 'styled-components';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

// Import restaurant images
import restaurant1 from '../images/burger.jpeg';
import restaurant2 from '../images/pizza.jpeg';
import restaurant3 from '../images/fries.jpg';

const CarouselContainer = styled.div`
  margin: 20px 0;
`;

const Tile = styled.div`
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const RestaurantImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 10px;
`;

const RestaurantName = styled.h3`
  font-size: 1.2rem;
  color: #333;
`;

const RestaurantCarousel = ({ onSelectRestaurant }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1
  };

  const restaurants = [
    { id: 1, name: 'Restaurant 1', image: restaurant1, menu: [{ id: 1, name: 'Pizza', price: 10, image: restaurant1 }, { id: 2, name: 'Burger', price: 8, image: restaurant1 }] },
    { id: 2, name: 'Restaurant 2', image: restaurant2, menu: [{ id: 1, name: 'Sushi', price: 15, image: restaurant2 }, { id: 2, name: 'Tempura', price: 12, image: restaurant2 }] },
    { id: 3, name: 'Restaurant 3', image: restaurant3, menu: [{ id: 1, name: 'Pasta', price: 12, image: restaurant3 }, { id: 2, name: 'Salad', price: 7, image: restaurant3 }] },
  ];

  return (
    <CarouselContainer>
      <h2>Restaurants</h2>
      <Slider {...settings}>
        {restaurants.map(restaurant => (
          <Tile key={restaurant.id} onClick={() => onSelectRestaurant(restaurant)}>
            <RestaurantImage src={restaurant.image} alt={restaurant.name} />
            <RestaurantName>{restaurant.name}</RestaurantName>
          </Tile>
        ))}
      </Slider>
    </CarouselContainer>
  );
};

export default RestaurantCarousel;
