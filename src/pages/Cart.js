import React from 'react';
import styled from 'styled-components';
import { useCart } from '../hooks/useCart';
import { useNavigate } from 'react-router-dom';
import { getCurrencySymbol, convertPrice } from '../utils/currency';

const CartContainer = styled.div`
  font-family: Arial, sans-serif;
  padding: 20px;
  padding-left: 250px;
  padding-right: 250px;
`;

const CartItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #e0e0e0;
  position: relative;
`;

const CartItemImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  margin-right: 20px;
`;

const CartItemDetails = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const CartItemName = styled.h3`
  margin: 0;
`;

const CartItemInfo = styled.p`
  margin: 5px 0;
  color: #555;
`;

const CartItemPrice = styled.p`
  margin: 5px 0;
  font-weight: bold;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  margin-right: 20px;
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

const RemoveButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: #00B5E2;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
`;

const CheckoutButton = styled.button`
  padding: 15px;
  background-color: #00B5E2;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  width: 100%;
  margin-top: 20px;
`;

const Summary = styled.div`
  text-align: right;
  margin-top: 20px;
`;

const SummaryItem = styled.p`
  margin: 5px 0;
  font-weight: bold;
`;

function Cart() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();
  const location = 'india'; // Replace with actual location logic

  const subtotal = cart.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  const handleUpdateQuantity = (item, quantity) => {
    if (quantity <= 0) {
      quantity = 1;
    }
    updateQuantity(item, quantity);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const currencySymbol = getCurrencySymbol(location);

  return (
    <CartContainer>
      <h1>Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        cart.map((item, index) => (
          <CartItem key={index}>
            <CartItemImage src={item.imageUrl || 'https://via.placeholder.com/100'} alt={item.name} />
            <CartItemDetails>
              <CartItemName>{item.name}</CartItemName>
              <CartItemInfo>{item.restaurantName}</CartItemInfo>
              <CartItemInfo>{item.deliveryTime}</CartItemInfo>
              <CartItemPrice>Price: {currencySymbol}{convertPrice(parseFloat(item.price), location)}</CartItemPrice>
              <QuantityControls>
                <QuantityButton onClick={() => handleUpdateQuantity(item, item.quantity - 1)}>-</QuantityButton>
                <QuantityDisplay>{item.quantity}</QuantityDisplay>
                <QuantityButton onClick={() => handleUpdateQuantity(item, item.quantity + 1)}>+</QuantityButton>
              </QuantityControls>
            </CartItemDetails>
            <RemoveButton onClick={() => removeFromCart(index)}>×</RemoveButton>
          </CartItem>
        ))
      )}
      {cart.length > 0 && (
        <>
          <Summary>
            <SummaryItem>Subtotal: {currencySymbol}{convertPrice(subtotal, location)}</SummaryItem>
            <SummaryItem>Tax (18%): {currencySymbol}{convertPrice(tax, location)}</SummaryItem>
            <SummaryItem>Total: {currencySymbol}{convertPrice(total, location)}</SummaryItem>
          </Summary>
          <CheckoutButton onClick={handleCheckout}>Proceed to Checkout</CheckoutButton>
        </>
      )}
    </CartContainer>
  );
}

export default Cart;
