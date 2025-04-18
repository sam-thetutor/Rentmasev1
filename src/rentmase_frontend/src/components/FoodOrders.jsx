import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getCurrencySymbol, convertPrice } from '../utils/currency';

const OrdersContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
  background-color: transparet;
  font-family: 'Poppins', sans-serif;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const Title = styled.h1`
  text-align: center;
  color: #008DD5;
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 30px;
`;

const OrderItem = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
`;

const OrderTitle = styled.h2`
  font-size: 20px;
  color: #333;
  margin-bottom: 10px;
`;

const OrderDetail = styled.p`
  margin: 5px 0;
  font-size: 16px;
  color: #555;
`;

const ItemsTitle = styled.h3`
  font-size: 18px;
  color: #333;
  margin-top: 15px;
  margin-bottom: 10px;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 5px;
`;

const EmptyOrdersMessage = styled.p`
  text-align: center;
  font-size: 18px;
  color: #888;
  margin-top: 20px;
`;

const FoodOrders = () => {
  const [orders, setOrders] = useState([]);
  const location = ''; // Set to default or pass as needed
  const currencySymbol = getCurrencySymbol(location);

  useEffect(() => {
    const fetchedOrders = JSON.parse(localStorage.getItem('orders')) || [];
    setOrders(fetchedOrders);
  }, []);

  return (
    <OrdersContainer>
      <Title>Deliveries</Title>
      {orders.length === 0 ? (
        <EmptyOrdersMessage>No orders placed yet.</EmptyOrdersMessage>
      ) : (
        orders.map((order, index) => (
          <OrderItem key={index}>
            <OrderTitle>Order #{order.orderId}</OrderTitle>
            <OrderDetail>
              Address: {order.address.name}, {order.address.street}, {order.address.building}, {order.address.phone}, {order.address.pincode}
            </OrderDetail>
            <OrderDetail>Time: {new Date(order.date).toLocaleString()}</OrderDetail>
            <OrderDetail>Total: {currencySymbol}{convertPrice(order.total, location)}</OrderDetail>
            <ItemsTitle>Items:</ItemsTitle>
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
