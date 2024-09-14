import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import foodData from '../components/foodData';
import { FaStar, FaHeart, FaRegHeart, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { getCurrencySymbol, convertPrice } from '../utils/currency';

const RestaurantsContainer = styled.div`
  font-family: 'Poppins', sans-serif; /* Updated to Poppins font */
  padding: 20px;
  text-align: center;
  position: relative; /* For positioning the arrows */
`;

const Title = styled.h1`
  color: #008DD5;
  text-align: center;
  margin-bottom: 20px;
  font-size: 32px;
  font-weight: bold;
`;

const RestaurantSlider = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 20px;
  overflow-x: auto;
  padding-left: 30px;
  padding-right: 30px;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    display: none; /* Hide the scrollbar */
  }
`;

const RestaurantCard = styled(Link)`
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  margin: 15px;
  min-width: 300px;
  text-decoration: none;
  color: inherit;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, outline 0.2s;

  &:hover {
    transform: translateY(-5px);
    outline: 2px solid #008DD5;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  background-color: white; /* Add white background to image container */
  padding: 10px; /* Add padding to separate the image from the border */
`;

const RestaurantImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain; /* Prevents cropping, fits the image within the container */
  background-color: white; /* Ensures the image background remains white */
`;

const DeliveryTimeOverlay = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 12px;
`;

const FavoriteButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: ${(props) => (props.isFavorite ? '#ff5a5f' : 'white')};

  &:hover {
    color: #ff5a5f;
  }
`;

const RestaurantContent = styled.div`
  padding: 15px;
`;

const RestaurantHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RestaurantName = styled.h3`
  margin: 0;
  color: #333;
  font-size: 18px;
  font-family: 'Poppins', sans-serif;
`;

const PriceRange = styled.p`
  color: #757575;
  margin: 0;
  font-size: 14px;
  font-family: 'Poppins', sans-serif;
`;

const RestaurantDetails = styled.p`
  color: #757575;
  margin: 5px 0;
  font-family: 'Poppins', sans-serif;
`;

const RestaurantLocation = styled.p`
  color: #757575;
  margin: 5px 0;
  font-family: 'Poppins', sans-serif;
`;

const Rating = styled.div`
  font-size: 14px;
  color: #ff9900;
  margin: 5px 0;
  display: flex;
  align-items: center;
`;

const RatingValue = styled.span`
  margin-left: 5px;
  color: #333;
  font-size: 14px;
  font-family: 'Poppins', sans-serif;
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

function Restaurants() {
  const [favorites, setFavorites] = useState([]);
  const location = ''; // Set to default
  const listRef = useRef(null);
  const itemWidth = 340; // Adjust the width for each restaurant card

  const toggleFavorite = (restaurantId) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(restaurantId)
        ? prevFavorites.filter((id) => id !== restaurantId)
        : [...prevFavorites, restaurantId]
    );
  };

  const scrollLeft = () => {
    if (listRef.current) {
      listRef.current.scrollBy({ left: -itemWidth, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (listRef.current) {
      listRef.current.scrollBy({ left: itemWidth, behavior: 'smooth' });
    }
  };

  return (
    <RestaurantsContainer>
      <Title>Restaurants</Title>
      <ArrowButton onClick={scrollLeft}>
        <FaChevronLeft />
      </ArrowButton>
      <RestaurantSlider ref={listRef}>
        {foodData.restaurants.map((restaurant) => {
          const currencySymbol = getCurrencySymbol(location);
          const minPrice = convertPrice(restaurant.priceRange[0], location);
          const maxPrice = convertPrice(restaurant.priceRange[1], location);

          return (
            <RestaurantCard key={restaurant.id} to={`/restaurant/${restaurant.id}`}>
              <ImageContainer>
                <RestaurantImage src={restaurant.imageUrl} alt={restaurant.name} />
                <DeliveryTimeOverlay>{restaurant.time}</DeliveryTimeOverlay>
                <FavoriteButton
                  onClick={(e) => {
                    e.preventDefault(); // Prevents navigation on click
                    toggleFavorite(restaurant.id);
                  }}
                  isFavorite={favorites.includes(restaurant.id)}
                >
                  {favorites.includes(restaurant.id) ? <FaHeart /> : <FaRegHeart />}
                </FavoriteButton>
              </ImageContainer>
              <RestaurantContent>
                <RestaurantHeader>
                  <RestaurantName>{restaurant.name}</RestaurantName>
                  <PriceRange>
                    {currencySymbol}{minPrice} - {currencySymbol}{maxPrice}
                  </PriceRange>
                </RestaurantHeader>
                <RestaurantDetails>{restaurant.details}</RestaurantDetails>
                <RestaurantLocation>{restaurant.location}</RestaurantLocation>
                <Rating>
                  <FaStar />
                  <RatingValue>{restaurant.rating} ({restaurant.reviews} reviews)</RatingValue>
                </Rating>
              </RestaurantContent>
            </RestaurantCard>
          );
        })}
      </RestaurantSlider>
      <ArrowButton onClick={scrollRight}>
        <FaChevronRight />
      </ArrowButton>
    </RestaurantsContainer>
  );
}

export default Restaurants;
