import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { getCurrencySymbol, convertPrice } from '../utils/currency';
import { FaCheck, FaHeart, FaRegHeart, FaStar } from 'react-icons/fa';

type StyleProps = {
  isFavorite: boolean;
};

const Card = styled.div`
  text-align: left;
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
    outline: 2px solid #008DD5;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  background-color: white; /* Add this line for a white background */
  padding: 10px; /* Optional: Add padding to create some space around the image */
  border-radius: 8px; /* Optional: Round the corners */
`;

const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: contain; /* Updated from cover to contain */
`;

const FavoriteButton = styled.button<StyleProps>`
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

const Brand = styled.p`
  font-size: 14px;
  color: #555;
  margin: 5px 0;
`;

const Price = styled.p`
  font-size: 14px;
  color: #333;
  margin: 5px 0;
  font-weight: bold;
`;

const Description = styled.p`
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

const AddToCartButton = styled.button`
  padding: 10px 20px;
  background-color: #cccccc; /* Gray out the button */
  color: white;
  border: none;
  border-radius: 5px;
  cursor: not-allowed; /* Show that the button is not clickable */
  margin-top: 10px;
  margin-bottom: 10px;
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: fit-content;
  transition: background-color 0.3s;
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

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const ProductCard = ({ product }) => {
  const { addToCart, updateQuantity, cart } = useCart();
  const location = ''; // Set to default
  const currencySymbol = getCurrencySymbol(location);
  const convertedPrice = convertPrice(product.price, location);

  const [favorites, setFavorites] = useState([]);

  const getItemQuantity = () => {
    const cartItem = cart.find((item) => item.uniqueId === product.id);
    return cartItem ? cartItem.quantity : 0;
  };

  const quantity = getItemQuantity();

  const placeholderImage = 'https://via.placeholder.com/300x200/CCCCCC/FFFFFF?text=No+Image';
  const imageUrl = product.images && product.images.length > 0 ? product.images[0] : placeholderImage;

  const toggleFavorite = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (favorites.includes(product.id)) {
      setFavorites(favorites.filter((id) => id !== product.id));
    } else {
      setFavorites([...favorites, product.id]);
    }
  };

  const averageRating = product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length;

  return (
    <StyledLink to={`/product/${product.id}`}>
      <Card>
        <ImageContainer>
          <ProductImage src={imageUrl} alt={product.name} />
          <FavoriteButton onClick={toggleFavorite} isFavorite={favorites.includes(product.id)}>
            {favorites.includes(product.id) ? <FaHeart /> : <FaRegHeart />}
          </FavoriteButton>
        </ImageContainer>
        <Content>
          <Title>{product.name}</Title>
          <Brand>{product.brand}</Brand>
          <Price>{currencySymbol}{convertedPrice}</Price>
          <Description>{product.description}</Description>
          <Rating>
            <FaStar />
            <RatingValue>{averageRating.toFixed(1)} ({product.reviews.length} reviews)</RatingValue>
          </Rating>
          <AddToCartButton disabled>
            Add to Cart
          </AddToCartButton>
        </Content>
      </Card>
    </StyledLink>
  );
};

export default ProductCard;
