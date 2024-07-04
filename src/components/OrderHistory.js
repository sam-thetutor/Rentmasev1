import React from 'react';
import styled from 'styled-components';

const OrderHistoryContainer = styled.div`
  padding: 20px;
`;

const OrderItem = styled.div`
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
`;

const OrderHistory = ({ orders }) => {
  return (
    <OrderHistoryContainer>
      <h2>Order History</h2>
      {orders.map((order, index) => (
        <OrderItem key={index}>
          <p><strong>Order {index + 1}</strong></p>
          <p>Name: {order.name}</p>
          <p>Address: {order.address}</p>
          <p>Payment: {order.payment}</p>
        </OrderItem>
      ))}
    </OrderHistoryContainer>
  );
};

export default OrderHistory;
