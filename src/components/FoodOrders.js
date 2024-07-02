// src/pages/FoodOrders.js
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getCurrencySymbol, convertPrice } from '../utils/currency';

const OrdersContainer = styled.div`
  font-family: Arial, sans-serif;
  padding: 20px;
  padding-left: 250px;
  padding-right: 250px;
`;

const OrderItem = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 15px;
  background-color: #f9f9f9;
`;

const OrderTitle = styled.h2`
  margin-top: 0;
`;

const OrderDetail = styled.p`
  margin: 5px 0;
`;

const FoodOrders = () => {
  const [orders, setOrders] = useState([]);
  const location = 'india'; // Replace with actual location logic
  const currencySymbol = getCurrencySymbol(location);

  useEffect(() => {
    const fetchedOrders = JSON.parse(localStorage.getItem('orders')) || [];
    setOrders(fetchedOrders);
  }, []);

  return (
    <OrdersContainer>
      <h1>Food Orders</h1>
      {orders.length === 0 ? (
        <p>No orders placed yet.</p>
      ) : (
        orders.map((order, index) => (
          <OrderItem key={index}>
            <OrderTitle>Order #{order.orderId}</OrderTitle>
            <OrderDetail>
              Address: {order.address.name}, {order.address.street}, {order.address.building}, {order.address.phone}, {order.address.pincode}
            </OrderDetail>
            <OrderDetail>Time: {new Date(order.date).toLocaleString()}</OrderDetail>
            <OrderDetail>Total: {currencySymbol}{convertPrice(order.total, location)}</OrderDetail>
            <h3>Items:</h3>
            {order.cart.map((item, idx) => (
              <OrderDetail key={idx}>
                {item.quantity} x {item.name} ({currencySymbol}{convertPrice(parseFloat(item.price), location)})
              </OrderDetail>
            ))}
          </OrderItem>
        ))
      )}
    </OrdersContainer>
  );
};

export default FoodOrders;
