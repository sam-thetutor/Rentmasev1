import React from 'react';
import Slider from 'react-slick';
import styled from 'styled-components';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

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
`;

const ProductImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 10px;
`;

const ProductName = styled.h3`
  font-size: 1.2rem;
  color: #333;
`;

const ProductPrice = styled.p`
  font-size: 1rem;
  color: #777;
`;

const AddToCartButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: #0056b3;
  }
`;

const FoodItemsCarousel = ({ restaurant, addToCart }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1
  };

  return (
    <CarouselContainer>
      <h2>{restaurant.name} - Menu</h2>
      <Slider {...settings}>
        {restaurant.menu.map(item => (
          <Tile key={item.id}>
            <ProductImage src={item.image} alt={item.name} />
            <ProductName>{item.name}</ProductName>
            <ProductPrice>${item.price}</ProductPrice>
            <AddToCartButton onClick={() => addToCart(item)}>
              Add to Cart
            </AddToCartButton>
          </Tile>
        ))}
      </Slider>
    </CarouselContainer>
  );
};

export default FoodItemsCarousel;
