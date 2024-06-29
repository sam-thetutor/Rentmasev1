import React from 'react';
import styled from 'styled-components';
import { ReactComponent as CartIcon } from '../images/cart.svg'; // Adjust the path as necessary

const Button = styled.button`
  background-color: transparent;
  border: none;
  padding: 5px 10px;
  margin-left: 10px;
  cursor: pointer;
  border-radius: 15px; /* Rounded corners */

  &:hover {
    background-color: #f0f0f0;
  }
`;

const StyledCartIcon = styled(CartIcon)`
  width: 24px;
  height: 24px;
  fill: black;
`;

const CartButton = () => {
  return (
    <Button>
      <StyledCartIcon />
    </Button>
  );
};

export default CartButton;
