import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaStar, FaHeart, FaRegHeart } from 'react-icons/fa';
import foodData from './foodData';
import { useCart } from '../hooks/useCart';
import { getCurrencySymbol, convertPrice } from '../utils/currency';

const InspirationContainer = styled.div`
  padding: 20px;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

const InspirationList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const InspirationItem = styled.div`
  text-align: center;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  margin: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;

  &:hover {
    transform: translateY(-5px);
    outline: 2px solid #00B5E2;
  }
`;

const InspirationImage = styled.img`
  width: 100%;
  height: 150px;
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
  color: ${(props) => (props.isFavorite ? '#ff5a5f' : '#ffffff')};
  cursor: pointer;
  font-size: 24px;
`;

const Details = styled.div`
  padding: 15px;
`;

const ItemName = styled.p`
  font-size: 16px;
  font-weight: bold;
  margin: 5px 0;
`;

const RestaurantName = styled.p`
  font-size: 14px;
  color: #555;
  margin: 5px 0;
`;

const Price = styled.p`
  font-size: 14px;
  color: #333;
  margin: 5px 0;
`;

const Rating = styled.div`
  font-size: 14px;
  color: #ff9900;
  margin: 5px 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RatingValue = styled.span`
  margin-left: 5px;
  color: #333;
  font-size: 14px;
`;

const AddToCartButton = styled.button`
  padding: 10px 20px;
  background-color: #00B5E2;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
`;

const QuantityButton = styled.button`
  padding: 5px 10px;
  background-color: #00B5E2;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const QuantityDisplay = styled.span`
  padding: 0 10px;
  font-size: 16px;
  font-weight: bold;
`;

const InspirationComponent = () => {
  const { addToCart, updateQuantity, cart } = useCart();
  const [shuffledFoodItems, setShuffledFoodItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const location = ''; // Set to default

  useEffect(() => {
    const foodItems = foodData.restaurants.flatMap((restaurant) =>
      restaurant.menu.map((item, index) => ({
        ...item,
        restaurantName: restaurant.name,
        restaurantDetails: restaurant.details,
        restaurantLocation: restaurant.location,
        restaurantRating: restaurant.rating,
        restaurantReviews: restaurant.reviews,
        uniqueId: `${restaurant.id}-${index}`, // Create a unique identifier
        deliveryTime: restaurant.time,
      }))
    );
    const shuffled = foodItems.sort(() => 0.5 - Math.random()).slice(0, 6);
    setShuffledFoodItems(shuffled);
  }, []);

  const handleAddToCart = (item) => {
    addToCart(item);
    setShuffledFoodItems((prevItems) =>
      prevItems.map((foodItem) =>
        foodItem.uniqueId === item.uniqueId
          ? { ...foodItem, added: true, quantity: 1 }
          : foodItem
      )
    );
  };

  const handleUpdateQuantity = (item, quantity) => {
    if (quantity <= 0) {
      quantity = 1;
    }
    updateQuantity(item, quantity);
    setShuffledFoodItems((prevItems) =>
      prevItems.map((foodItem) =>
        foodItem.uniqueId === item.uniqueId
          ? { ...foodItem, quantity }
          : foodItem
      )
    );
  };

  const toggleFavorite = (item) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(item.uniqueId)
        ? prevFavorites.filter((id) => id !== item.uniqueId)
        : [...prevFavorites, item.uniqueId]
    );
  };

  const getItemQuantity = (item) => {
    const cartItem = cart.find((cartItem) => cartItem.uniqueId === item.uniqueId);
    return cartItem ? cartItem.quantity : 0;
  };

  return (
    <InspirationContainer>
      <Title>Inspiration for your first order</Title>
      <InspirationList>
        {shuffledFoodItems.map((item, index) => {
          const currencySymbol = getCurrencySymbol(location);
          const price = convertPrice(item.price, location);

          return (
            <InspirationItem key={index}>
              <InspirationImage src={item.imageUrl} alt={item.name} />
              <DeliveryTimeOverlay>{item.deliveryTime}</DeliveryTimeOverlay>
              <FavoriteButton
                onClick={() => toggleFavorite(item)}
                isFavorite={favorites.includes(item.uniqueId)}
              >
                {favorites.includes(item.uniqueId) ? <FaHeart /> : <FaRegHeart />}
              </FavoriteButton>
              <Details>
                <ItemName>{item.name}</ItemName>
                <RestaurantName>{item.restaurantName}</RestaurantName>
                <Price>Price: {currencySymbol}{price}</Price>
                <Rating>
                  <FaStar />
                  <RatingValue>{item.restaurantRating} ({item.restaurantReviews} reviews)</RatingValue>
                </Rating>
                {item.added ? (
                  <QuantityControls>
                    <QuantityButton onClick={() => handleUpdateQuantity(item, getItemQuantity(item) - 1)}>-</QuantityButton>
                    <QuantityDisplay>{getItemQuantity(item)}</QuantityDisplay>
                    <QuantityButton onClick={() => handleUpdateQuantity(item, getItemQuantity(item) + 1)}>+</QuantityButton>
                  </QuantityControls>
                ) : (
                  <AddToCartButton onClick={() => handleAddToCart(item)}>
                    Add to Cart
                  </AddToCartButton>
                )}
              </Details>
            </InspirationItem>
          );
        })}
      </InspirationList>
    </InspirationContainer>
  );
};

export default InspirationComponent;
