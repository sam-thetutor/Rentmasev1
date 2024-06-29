import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const OuterContainer = styled.div`
  width: 80%;
  padding: 20px; /* Added padding */
  box-sizing: border-box; /* Ensure padding is included in the width */
  position: relative;
`;

const SliderContainer = styled.div`
  width: calc(100% - 40px); /* Subtract padding from width */
  margin: auto;
  overflow: hidden;
  position: relative;
  border-radius: 15px; /* Curved borders for the container */
`;

const SliderWrapper = styled.div`
  display: flex;
  transition: ${(props) => (props.isTransitioning ? 'transform 0.5s ease-in-out' : 'none')};
  transform: ${(props) => `translateX(-${props.activeIndex * 100}%)`};
`;

const Slide = styled.div`
  min-width: 100%;
  height: 500px; /* Fixed height for the images */
  background: ${(props) => `url(${props.image})`} center/cover no-repeat;
  border-radius: 15px; /* Curved borders for each slide */
`;

const DotsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const Dot = styled.div`
  width: 10px;
  height: 10px;
  margin: 0 5px;
  background-color: ${(props) => (props.active ? 'blue' : 'gray')};
  border-radius: 50%;
  cursor: pointer;
`;

const ImageSlider = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(1); // Start at the first real slide
  const [isTransitioning, setIsTransitioning] = useState(false);
  const totalSlides = images.length;
  const transitionTimeoutRef = useRef(null);

  const handleTransitionEnd = () => {
    setIsTransitioning(false);
    if (activeIndex === 0) {
      setActiveIndex(totalSlides);
    } else if (activeIndex === totalSlides + 1) {
      setActiveIndex(1);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setActiveIndex((prevIndex) => prevIndex + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, [totalSlides]);

  useEffect(() => {
    if (isTransitioning) {
      transitionTimeoutRef.current = setTimeout(() => {
        handleTransitionEnd();
      }, 500); // Match the transition duration
    }
    return () => clearTimeout(transitionTimeoutRef.current);
  }, [activeIndex, isTransitioning]);

  const goToSlide = (index) => {
    setIsTransitioning(true);
    setActiveIndex(index + 1); // Adjust for the duplicated first slide
  };

  const slides = [images[totalSlides - 1], ...images, images[0]]; // Duplicate last and first slides

  return (
    <OuterContainer>
      <SliderContainer>
        <SliderWrapper activeIndex={activeIndex} isTransitioning={isTransitioning}>
          {slides.map((image, index) => (
            <Slide key={index} image={image} />
          ))}
        </SliderWrapper>
      </SliderContainer>
      <DotsContainer>
        {images.map((_, index) => (
          <Dot
            key={index}
            active={activeIndex === index + 1}
            onClick={() => goToSlide(index)}
          />
        ))}
      </DotsContainer>
    </OuterContainer>
  );
};

export default ImageSlider;
