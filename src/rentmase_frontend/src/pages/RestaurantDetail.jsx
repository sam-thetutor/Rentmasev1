import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { FaStar, FaHeart, FaRegHeart } from 'react-icons/fa';
import foodData from '../components/foodData';
import { useCart } from '../hooks/useCart';
import { getCurrencySymbol, convertPrice } from '../utils/currency';

const RestaurantDetailContainer = styled.div`
  font-family: Arial, sans-serif;
  padding: 20px;
  text-align: center;
`;

const RestaurantHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const RestaurantImage = styled.img`
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 20px;
`;

const RestaurantInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const RestaurantName = styled.h1`
  margin: 0;
`;

const RestaurantDetails = styled.p`
  margin: 5px 0;
`;

const MenuTitle = styled.h2`
  text-align: center;
  margin-top: 80px;
`;

const Menu = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 20px;
`;

const MenuItem = styled.div`
  text-align: center;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  margin: 10px;
  width: 220px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;

  &:hover {
    transform: translateY(-5px);
    outline: 2px solid #008DD5;
  }
`;

const MenuItemImageContainer = styled.div`
  position: relative;
  background-color: white;
  padding: 10px;
  border-radius: 10px;
`;

const MenuItemImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: contain;
  background-color: white;
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
  text-align: left;
`;

const ItemName = styled.p`
  font-size: 16px;
  font-weight: bold;
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
  justify-content: flex-start;
`;

const RatingValue = styled.span`
  margin-left: 5px;
  color: #333;
  font-size: 14px;
`;

const AddToCartButton = styled.button`
  display: block;
  padding: 10px 20px;
  background-color: #cccccc; /* Gray out when disabled */
  color: white;
  border: none;
  border-radius: 5px;
  cursor: not-allowed; /* Indicate button is not clickable */
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: auto;
  margin-right: auto;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
`;

const QuantityButton = styled.button`
  padding: 5px 10px;
  background-color: #008DD5;
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

function RestaurantDetail() {
  const { id } = useParams();
  const restaurant = foodData.restaurants.find((rest) => rest.id.toString() === id);
  const { addToCart, updateQuantity, cart } = useCart();
  const [favorites, setFavorites] = useState([]);
  const location = ''; // Set to default

  const toggleFavorite = (item) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(item.id)
        ? prevFavorites.filter((id) => id !== item.id)
        : [...prevFavorites, item.id]
    );
  };

  const getItemQuantity = (item) => {
    const cartItem = cart.find((cartItem) => cartItem.uniqueId === `${restaurant.id}-${item.id}`);
    return cartItem ? cartItem.quantity : 0;
  };

  if (!restaurant) {
    return <p>Restaurant not found</p>;
  }

  return (
    <RestaurantDetailContainer>
      <RestaurantHeader>
        <RestaurantImage src={restaurant.imageUrl} alt={restaurant.name} />
        <RestaurantInfo>
          <RestaurantName>{restaurant.name}</RestaurantName>
          <RestaurantDetails>{restaurant.details}</RestaurantDetails>
          <RestaurantDetails>{restaurant.location}</RestaurantDetails>
        </RestaurantInfo>
      </RestaurantHeader>
      <MenuTitle>Menu</MenuTitle>
      <Menu>
        {restaurant.menu.map((item) => {
          const currencySymbol = getCurrencySymbol(location);
          const price = convertPrice(item.price, location);

          return (
            <MenuItem key={item.id}>
              <MenuItemImage src={item.imageUrl} alt={item.name} />
              <DeliveryTimeOverlay>{restaurant.time}</DeliveryTimeOverlay>
              <FavoriteButton
                onClick={() => toggleFavorite(item)}
                isFavorite={favorites.includes(item.id)}
              >
                {favorites.includes(item.id) ? <FaHeart /> : <FaRegHeart />}
              </FavoriteButton>
              <Details>
                <ItemName>{item.name}</ItemName>
                <Price>Price: {currencySymbol}{price}</Price>
                <Rating>
                  <FaStar />
                  <RatingValue>{restaurant.rating}</RatingValue>
                </Rating>
                <AddToCartButton disabled>
                  Add to Cart
                </AddToCartButton>
              </Details>
            </MenuItem>
          );
        })}
      </Menu>
    </RestaurantDetailContainer>
  );
}

export default RestaurantDetail;
