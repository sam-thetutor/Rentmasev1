import React from 'react';
import styled from 'styled-components';
import CartIcon from '/images/cart.svg'; // Adjust the path as necessary
import { useCart } from '../hooks/useCart';
import { useNavigate } from 'react-router-dom';

const Button = styled.button`
  background-color: transparent;
  border: none;
  padding: 5px 10px;
  margin-left: 10px;
  cursor: pointer;
  border-radius: 15px; /* Rounded corners */
  display: flex;
  align-items: center;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const StyledCartIcon = styled(CartIcon)`
  width: 24px;
  height: 24px;
  fill: black;
`;

const CartCount = styled.span`
  background-color: #00B5E2;
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  margin-left: 5px;
  font-size: 14px;
`;

const CartButton = () => {
  const { cart } = useCart();
  const navigate = useNavigate();
  const itemCount = cart.length;

  return (
    <Button onClick={() => navigate('/cart')}>
      <StyledCartIcon />
      {itemCount > 0 && <CartCount>{itemCount}</CartCount>}
    </Button>
  );
};

export default CartButton;
