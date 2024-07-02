import React, { createContext, useContext, useState } from 'react';

const OrderHistoryContext = createContext();

export const useOrderHistory = () => {
  return useContext(OrderHistoryContext);
};

export const OrderHistoryProvider = ({ children }) => {
  const [orderHistory, setOrderHistory] = useState([]);

  const addOrderToHistory = (order) => {
    setOrderHistory([...orderHistory, order]);
  };

  return (
    <OrderHistoryContext.Provider value={{ orderHistory, addOrderToHistory }}>
      {children}
    </OrderHistoryContext.Provider>
  );
};
