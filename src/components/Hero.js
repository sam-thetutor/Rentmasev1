import React from 'react';
import styled from 'styled-components';
import ImageSlider from './ImageSlider';

const HeroContainer = styled.div`
  width: 100%;
  height: 600px; /* Adjust the height as needed */
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f8f9fa; /* Optional background color */
`;

const images = [
  '../images/slider1.webp',
  '../images/slider2.webp',
  '../images/slider3.webp',
  // Add more image paths as needed
];

const Hero = () => {
  return (
    <HeroContainer>
      <ImageSlider images={images} />
    </HeroContainer>
  );
};

export default Hero;
