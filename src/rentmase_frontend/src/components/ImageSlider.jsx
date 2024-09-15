import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import slider1 from '/images/SLIDER/SLIDER1.jpg';
import slider2 from '/images/SLIDER/SLIDER2.jpg';
import slider3 from '/images/SLIDER/SLIDER3.jpg';

const OuterContainer = styled.div`
  width: 100%;
  max-width: 1000px;
  padding: 0;  /* Removed padding */
  box-sizing: border-box;
  position: relative;
`;

const SliderContainer = styled.div`
  width: 100%;
  margin: auto;
  overflow: hidden;
  position: relative;
  
  background-color: transparent;
  border-radius: ${({ $isCurved }) => ($isCurved ? '15px' : '0')};
  transition: border-radius 0.5s ease-in-out;
  
  /* Add box-shadow for soft effect */
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.35); /* Customize the shadow */
`;


const SliderWrapper = styled.div`
  display: flex;
  width: 100%;
  transform: ${({ $activeIndex }) => `translateX(-${$activeIndex * 100}%)`};
  transition: ${({ $isTransitioning }) => ($isTransitioning ? 'transform 0.5s ease-in-out' : 'none')};
`;

const Slide = styled.div`
  min-width: 100%;
  height: 0;
  padding-bottom: 50%; /* Maintain aspect ratio */
  background: center/contain no-repeat;
  border-radius: ${({ $isCurved }) => ($isCurved ? '15px' : '0')};
  transition: border-radius 0.5s ease-in-out;
  background-image: url(${props => props.image});
`;

const DotsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 40px;
`;

const Dot = styled.div`
  width: 10px;
  height: 10px;
  margin: 0 5px;
  background-color: ${props => (props.$active ? '#008DD5' : 'gray')};
  border-radius: 50%;
  cursor: pointer;
`;

const ImageSlider = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isCurved, setIsCurved] = useState(true);
  const totalSlides = images.length;
  const transitionTimeoutRef = useRef(null);

  const handleTransitionEnd = () => {
    setIsTransitioning(false);
    setIsCurved(true);
    if (activeIndex === 0) {
      setActiveIndex(totalSlides);
    } else if (activeIndex === totalSlides + 1) {
      setActiveIndex(1);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIsCurved(false);
      setTimeout(() => {
        setIsTransitioning(true);
        setActiveIndex((prevIndex) => prevIndex + 1);
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, [totalSlides]);

  useEffect(() => {
    if (isTransitioning) {
      transitionTimeoutRef.current = setTimeout(() => {
        handleTransitionEnd();
      }, 500);
    }
    return () => clearTimeout(transitionTimeoutRef.current);
  }, [activeIndex, isTransitioning]);

  const goToSlide = (index) => {
    setIsCurved(false);
    setTimeout(() => {
      setIsTransitioning(true);
      setActiveIndex(index + 1);
    }, 100);
  };

  const slides = [images[totalSlides - 1], ...images, images[0]];

  return (
    <OuterContainer>
      <SliderContainer $isCurved={isCurved}>
        <SliderWrapper $activeIndex={activeIndex} $isTransitioning={isTransitioning}>
          {slides.map((image, index) => (
            <Slide key={index} image={image} $isCurved={isCurved} />
          ))}
        </SliderWrapper>
      </SliderContainer>
      <DotsContainer>
        {images.map((_, index) => (
          <Dot
            key={index}
            $active={activeIndex === index + 1}
            onClick={() => goToSlide(index)}
          />
        ))}
      </DotsContainer>
    </OuterContainer>
  );
};

const App = () => {
  const images = [slider1, slider2, slider3];

  return <ImageSlider images={images} />;
};

export default App;
