import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaStar } from 'react-icons/fa';
import { getCurrencySymbol, convertPrice } from '../utils/currency';

const Card = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  margin: 15px;
  width: 300px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
  position: relative;

  &:hover {
    transform: translateY(-5px);
    outline: 2px solid #00B5E2;
  }
`;

const ImageContainer = styled.div`
  position: relative;
`;

const Image = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
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

const Content = styled.div`
  padding: 15px;
  text-align: left;
`;

const Title = styled.h3`
  margin: 0;
  color: #333;
  font-size: 18px;
`;

const Location = styled.p`
  color: #757575;
  margin: 5px 0;
`;

const Details = styled.p`
  color: #757575;
  margin: 5px 0;
`;

const Price = styled.p`
  color: #333;
  font-weight: bold;
  margin: 5px 0;
`;

const Host = styled.p`
  color: #757575;
  margin: 5px 0;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  color: #ff9900;
  margin-top: 5px;
`;

const RatingValue = styled.span`
  margin-left: 5px;
  color: #333;
  font-size: 16px;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const RestaurantCard = ({ restaurant }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [convertedPrice, setConvertedPrice] = useState(restaurant.priceRange[0]);
  const [currencySymbol, setCurrencySymbol] = useState('$');
  const location = ''; // Set to default

  useEffect(() => {
    const symbol = getCurrencySymbol(location);
    const minPrice = convertPrice(restaurant.priceRange[0], location);
    const maxPrice = convertPrice(restaurant.priceRange[1], location);
    setCurrencySymbol(symbol);
    setConvertedPrice(`${minPrice} - ${maxPrice}`);
  }, [restaurant.priceRange, location]);

  const toggleFavorite = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsFavorite(!isFavorite);
  };

  return (
    <StyledLink to={`/restaurant/${restaurant.id}`}>
      <Card>
        <ImageContainer>
          <Image src={restaurant.imageUrl} alt={restaurant.name} />
          <FavoriteButton onClick={toggleFavorite} isFavorite={isFavorite}>
            {isFavorite ? <FaHeart /> : <FaRegHeart />}
          </FavoriteButton>
        </ImageContainer>
        <Content>
          <Title>{restaurant.name}</Title>
          <Location>{restaurant.location}</Location>
          <Details>{restaurant.details}</Details>
          <Price>{currencySymbol}{convertedPrice}</Price>
          <Rating>
            <FaStar />
            <RatingValue>{restaurant.rating} ({restaurant.reviews} reviews)</RatingValue>
          </Rating>
        </Content>
      </Card>
    </StyledLink>
  );
};

export default RestaurantCard;
