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
  'https://via.placeholder.com/800x400?text=Slide+1',
  'https://via.placeholder.com/800x400?text=Slide+2',
  'https://via.placeholder.com/800x400?text=Slide+3',
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
