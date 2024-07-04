import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaStar, FaHeart, FaRegHeart, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import foodData from '../components/foodData';
import { getCurrencySymbol, convertPrice } from '../utils/currency';

const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  padding: 20px 0;
`;

const List = styled.div`
  display: flex;
  overflow: hidden;
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

const RestaurantCard = styled(Link)`
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  margin: 15px;
  width: 350px;
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
  text-align: left;
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

const itemsPerPage = 5; // Number of items to display at a time

function RestaurantSlider() {
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const location = ''; // Set to default
  const listRef = useRef(null);

  const toggleFavorite = (restaurantId) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(restaurantId)
        ? prevFavorites.filter((id) => id !== restaurantId)
        : [...prevFavorites, restaurantId]
    );
  };

  const scrollLeft = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const scrollRight = () => {
    if ((currentPage + 1) * itemsPerPage < foodData.restaurants.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const slicedRestaurants = foodData.restaurants.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  useEffect(() => {
    listRef.current.scrollTo({ left: 0, behavior: 'smooth' });
  }, [currentPage]);

  return (
    <CarouselContainer>
      <ArrowButton onClick={scrollLeft} disabled={currentPage === 0}>
        <FaChevronLeft />
      </ArrowButton>
      <List ref={listRef}>
        {slicedRestaurants.map((restaurant) => {
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
      </List>
      <ArrowButton onClick={scrollRight} disabled={(currentPage + 1) * itemsPerPage >= foodData.restaurants.length}>
        <FaChevronRight />
      </ArrowButton>
    </CarouselContainer>
  );
}

export default RestaurantSlider;
