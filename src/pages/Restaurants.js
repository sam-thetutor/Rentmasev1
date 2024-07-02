import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import foodData from '../components/foodData';
import { FaStar, FaHeart, FaRegHeart } from 'react-icons/fa';
import { getCurrencySymbol, convertPrice } from '../utils/currency';

const RestaurantsContainer = styled.div`
  font-family: Arial, sans-serif;
  padding: 20px;
`;

const RestaurantList = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const RestaurantCard = styled(Link)`
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  margin: 15px;
  width: 300px;
  text-decoration: none;
  color: inherit;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, outline 0.2s;

  &:hover {
    transform: translateY(-5px);
    outline: 2px solid #00B5E2;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
`;

const RestaurantImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
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
`;

const PriceRange = styled.p`
  color: #757575;
  margin: 0;
  font-size: 14px;
`;

const RestaurantDetails = styled.p`
  color: #757575;
  margin: 5px 0;
`;

const RestaurantLocation = styled.p`
  color: #757575;
  margin: 5px 0;
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
`;

function Restaurants() {
  const [favorites, setFavorites] = useState([]);
  const location = 'india'; // Replace with actual location logic

  const toggleFavorite = (restaurantId) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(restaurantId)
        ? prevFavorites.filter((id) => id !== restaurantId)
        : [...prevFavorites, restaurantId]
    );
  };

  return (
    <RestaurantsContainer>
      <h1>Restaurants</h1>
      <RestaurantList>
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
      </RestaurantList>
    </RestaurantsContainer>
  );
}

export default Restaurants;
