import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
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

const FavoriteButton = styled.button.attrs(() => ({
  isFavorite: undefined, // Prevent isFavorite from being passed to the DOM
}))`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: ${(props) => (props.$isFavorite ? '#ff5a5f' : '#ffffff')};
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

const Description = styled.p`
  color: #757575;
  margin: 5px 0;
`;

const Price = styled.p`
  color: #333;
  font-weight: bold;
  margin: 5px 0;
`;

const CashbackCard = ({ cashback }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [convertedPrice, setConvertedPrice] = useState(cashback.price || 0); // Fallback to 0 if price is undefined
  const [currencySymbol, setCurrencySymbol] = useState('$');
  const location = ''; // Set to default location

  useEffect(() => {
    const symbol = getCurrencySymbol(location);
    const price = convertPrice(cashback.price || 0, location); // Use default value for price
    setCurrencySymbol(symbol);
    setConvertedPrice(price);
  }, [cashback.price, location]);

  const toggleFavorite = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsFavorite(!isFavorite);
  };

  return (
    <Card>
      <ImageContainer>
        <Image src={cashback.imageUrl} alt={cashback.title} />
        <FavoriteButton onClick={toggleFavorite} $isFavorite={isFavorite}>
          {isFavorite ? <FaHeart /> : <FaRegHeart />}
        </FavoriteButton>
      </ImageContainer>
      <Content>
        <Title>{cashback.title}</Title>
        <Description>{cashback.description}</Description>
        <Price>{currencySymbol}{convertedPrice.toFixed(2)}</Price>
      </Content>
    </Card>
  );
};

export default CashbackCard;
