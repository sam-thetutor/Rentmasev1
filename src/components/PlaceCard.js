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

const PlaceCard = ({ place }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [convertedPrice, setConvertedPrice] = useState(place.price);
  const [currencySymbol, setCurrencySymbol] = useState('$');
  const location = 'india'; // Replace with actual location logic

  useEffect(() => {
    const symbol = getCurrencySymbol(location);
    const price = convertPrice(place.price, location);
    setCurrencySymbol(symbol);
    setConvertedPrice(price);
  }, [place.price, location]);

  const toggleFavorite = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsFavorite(!isFavorite);
  };

  return (
    <StyledLink to={`/place/${place.id}`}>
      <Card>
        <ImageContainer>
          <Image src={place.imageUrl} alt={place.name} />
          <FavoriteButton onClick={toggleFavorite} isFavorite={isFavorite}>
            {isFavorite ? <FaHeart /> : <FaRegHeart />}
          </FavoriteButton>
        </ImageContainer>
        <Content>
          <Title>{place.name}</Title>
          <Location>{place.location}</Location>
          <Details>{place.distance} kilometres away</Details>
          <Details>{place.dates}</Details>
          <Price>{currencySymbol}{convertedPrice} total before taxes</Price>
          <Host>Hosted by {place.host}</Host>
          <Rating>
            <FaStar />
            <RatingValue>{place.rating}</RatingValue>
          </Rating>
        </Content>
      </Card>
    </StyledLink>
  );
};

export default PlaceCard;
