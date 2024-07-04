// src/pages/OrderConfirmation.js
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { getCurrencySymbol, convertPrice } from '../utils/currency';

const ConfirmationContainer = styled.div`
  font-family: Arial, sans-serif;
  padding: 20px;
  padding-left: 250px;
  padding-right: 250px;

  @media (max-width: 768px) {
    padding-left: 20px;
    padding-right: 20px;
  }
`;

const OrderDetail = styled.p`
  margin: 5px 0;
  font-weight: bold;
`;

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId, address, cart, total } = location.state || {};
  const { clearCart } = useCart();
  const orderDate = new Date();
  const userLocation = ''; // Replace with actual location logic
  const currencySymbol = getCurrencySymbol(userLocation);

  const order = {
    orderId,
    address,
    date: orderDate,
    total,
    cart
  };

  useEffect(() => {
    const saveOrder = () => {
      const orders = JSON.parse(localStorage.getItem('orders')) || [];
      if (!orders.find(o => o.orderId === order.orderId)) {
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
      }
    };

    if (orderId && address && cart && total) {
      saveOrder();
      clearCart();
    }
  }, [order, clearCart]);

  if (!address) {
    return <p>Order not found or address missing.</p>;
  }

  return (
    <ConfirmationContainer>
      <h1>Order Confirmation</h1>
      <OrderDetail>Order ID: {orderId}</OrderDetail>
      <OrderDetail>Address: {address.name}, {address.street}, {address.building}, {address.phone}, {address.pincode}</OrderDetail>
      <OrderDetail>Order Date: {orderDate.toLocaleString()}</OrderDetail>
      <OrderDetail>Total: {currencySymbol}{convertPrice(total, userLocation)}</OrderDetail>
      <h3>Items:</h3>
      {cart.map((item, index) => (
        <OrderDetail key={index}>
          {item.quantity} x {item.name} ({currencySymbol}{convertPrice(parseFloat(item.price), userLocation)})
        </OrderDetail>
      ))}
      <button onClick={() => navigate('/deliveries')}>View Orders</button>
    </ConfirmationContainer>
  );
};

export default OrderConfirmation;
