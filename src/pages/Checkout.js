import React, { useState } from 'react';
import styled from 'styled-components';
import { useCart } from '../hooks/useCart';
import { useNavigate } from 'react-router-dom';
import { getCurrencySymbol, convertPrice } from '../utils/currency';

const CheckoutContainer = styled.div`
  font-family: Arial, sans-serif;
  padding: 20px;
  padding-left: 250px;
  padding-right: 250px;
`;

const AddressForm = styled.form`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #00B5E2;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
`;

const Summary = styled.div`
  text-align: left;
  margin-top: 20px;
`;

const SummaryItem = styled.p`
  margin: 5px 0;
  font-weight: bold;
`;

function Checkout() {
  const { cart, clearCart } = useCart();
  const [address, setAddress] = useState('');
  const navigate = useNavigate();
  const location = 'india'; // Replace with actual location logic

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handlePlaceOrder = () => {
    const orderId = Math.floor(Math.random() * 1000000); // Generate a random order ID
    // Save the order (this could be an API call in a real app)
    // For this example, we'll just clear the cart and navigate to the order confirmation page
    clearCart();
    navigate(`/order-confirmation/${orderId}`, { state: { orderId, address, cart, total } });
  };

  const currencySymbol = getCurrencySymbol(location);

  return (
    <CheckoutContainer>
      <h1>Checkout</h1>
      <AddressForm>
        <Input type="text" placeholder="Enter your address" value={address} onChange={handleAddressChange} />
        <Button type="button" onClick={handlePlaceOrder}>Place Order</Button>
      </AddressForm>
      <Summary>
        <h2>Order Summary</h2>
        {cart.map((item, index) => (
          <SummaryItem key={index}>
            {item.quantity} x {item.name} ({currencySymbol}{convertPrice(parseFloat(item.price), location)})
          </SummaryItem>
        ))}
        <SummaryItem>Subtotal: {currencySymbol}{convertPrice(subtotal, location)}</SummaryItem>
        <SummaryItem>Tax (18%): {currencySymbol}{convertPrice(tax, location)}</SummaryItem>
        <SummaryItem>Total: {currencySymbol}{convertPrice(total, location)}</SummaryItem>
      </Summary>
    </CheckoutContainer>
  );
}

export default Checkout;
