import React from 'react';
import OrderHistory from '../components/OrderHistory';

const OrderHistoryPage = ({ orders }) => {
  return (
    <div>
      <OrderHistory orders={orders} />
    </div>
  );
};

export default OrderHistoryPage;
