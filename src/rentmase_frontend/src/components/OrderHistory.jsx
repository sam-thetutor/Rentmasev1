import React from 'react';
import styled from 'styled-components';

const OrderHistoryContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
  background-color: #f9f9f9;
  font-family: 'Poppins', sans-serif;
`;

const Title = styled.h2`
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
  border-left: 5px solid #008DD5; /* Accent border on the left */
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
`;

const OrderDetails = styled.p`
  margin: 5px 0;
  font-size: 16px;
  color: #333;
`;

const StrongText = styled.span`
  font-weight: 600;
  color: #008DD5;
`;

const OrderHistory = ({ orders }) => {
  return (
    <OrderHistoryContainer>
      <Title>Order History</Title>
      {orders.map((order, index) => (
        <OrderItem key={index}>
          <OrderDetails>
            <StrongText>Order {index + 1}</StrongText>
          </OrderDetails>
          <OrderDetails>Name: <StrongText>{order.name}</StrongText></OrderDetails>
          <OrderDetails>Address: <StrongText>{order.address}</StrongText></OrderDetails>
          <OrderDetails>Payment: <StrongText>{order.payment}</StrongText></OrderDetails>
        </OrderItem>
      ))}
    </OrderHistoryContainer>
  );
};

export default OrderHistory;
