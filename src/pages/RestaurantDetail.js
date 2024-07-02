// src/pages/RestaurantDetail.js
import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import foodData from '../components/foodData';
import { useCart } from '../hooks/useCart';

const RestaurantDetailContainer = styled.div`
  font-family: Arial, sans-serif;
  padding: 20px;
`;

const RestaurantHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const RestaurantImage = styled.img`
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 10px;
  margin-right: 20px;
`;

const RestaurantInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const RestaurantName = styled.h1`
  margin: 0;
`;

const RestaurantDetails = styled.p`
  margin: 5px 0;
`;

const Menu = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const MenuItem = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  margin: 15px;
  width: 200px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const MenuItemImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
`;

const MenuItemContent = styled.div`
  padding: 10px;
`;

const MenuItemName = styled.h3`
  margin: 0;
  font-size: 16px;
`;

const MenuItemPrice = styled.p`
  margin: 5px 0;
  font-weight: bold;
`;

const AddToCartButton = styled.button`
  padding: 10px;
  background-color: #ff5a5f;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
`;

function RestaurantDetail() {
  const { id } = useParams();
  const restaurant = foodData.restaurants.find(rest => rest.id.toString() === id);
  const { addToCart } = useCart();

  const handleAddToCart = (item) => {
    addToCart(item);
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
      <h2>Menu</h2>
      <Menu>
        {restaurant.menu.map((item) => (
          <MenuItem key={item.id}>
            <MenuItemImage src={item.imageUrl} alt={item.name} />
            <MenuItemContent>
              <MenuItemName>{item.name}</MenuItemName>
              <MenuItemPrice>{item.price}</MenuItemPrice>
              <AddToCartButton onClick={() => handleAddToCart(item)}>Add to Cart</AddToCartButton>
            </MenuItemContent>
          </MenuItem>
        ))}
      </Menu>
    </RestaurantDetailContainer>
  );
}

export default RestaurantDetail;
