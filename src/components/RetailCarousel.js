import React from 'react';
import Slider from 'react-slick';
import styled from 'styled-components';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const CarouselContainer = styled.div`
  margin: 20px 0;
`;

const Slide = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f9f9f9;
  border-radius: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const ProductImage = styled.img`
  width: 100px;
  height: 100px;
  margin-bottom: 10px;
`;

const ProductTitle = styled.p`
  font-size: 1rem;
  color: #333;
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

const RetailCarousel = ({ addToCart }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3
  };

  const products = [
    { id: 1, name: 'Laptop', image: '/images/retail-item1.jpg' },
    { id: 2, name: 'Headphones', image: '/images/retail-item2.jpg' },
    { id: 3, name: 'Smartphone', image: '/images/retail-item3.jpg' },
    // Add more products as needed
  ];

  return (
    <CarouselContainer>
      <h2>Retail</h2>
      <Slider {...settings}>
        {products.map(product => (
          <Slide key={product.id}>
            <ProductImage src={product.image} alt={product.name} />
            <ProductTitle>{product.name}</ProductTitle>
            <AddToCartButton onClick={() => addToCart(product)}>
              Add to Cart
            </AddToCartButton>
          </Slide>
        ))}
      </Slider>
    </CarouselContainer>
  );
};

export default RetailCarousel;
