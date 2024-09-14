import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getCurrencySymbol, convertPrice } from '../utils/currency';

const PurchasesContainer = styled.div`
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

const PurchaseItem = styled.div`
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

const PurchaseTitle = styled.h2`
  font-size: 20px;
  color: #333;
  margin-bottom: 10px;
`;

const PurchaseDetail = styled.p`
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

const EmptyPurchasesMessage = styled.p`
  text-align: center;
  font-size: 18px;
  color: #888;
  margin-top: 20px;
`;

const PurchasesHistory = () => {
  const [purchases, setPurchases] = useState([]);
  const location = ''; // Set to default or pass as needed
  const currencySymbol = getCurrencySymbol(location);

  useEffect(() => {
    const fetchedPurchases = JSON.parse(localStorage.getItem('purchases')) || [];
    setPurchases(fetchedPurchases);
  }, []);

  return (
    <PurchasesContainer>
      <Title>Purchase History</Title>
      {purchases.length === 0 ? (
        <EmptyPurchasesMessage>No purchases made yet.</EmptyPurchasesMessage>
      ) : (
        purchases.map((purchase, index) => (
          <PurchaseItem key={index}>
            <PurchaseTitle>Purchase #{purchase.purchaseId}</PurchaseTitle>
            <PurchaseDetail>
              Address: {purchase.address.name}, {purchase.address.street}, {purchase.address.building}, {purchase.address.phone}, {purchase.address.pincode}
            </PurchaseDetail>
            <PurchaseDetail>Time: {new Date(purchase.date).toLocaleString()}</PurchaseDetail>
            <PurchaseDetail>Total: {currencySymbol}{convertPrice(purchase.total, location)}</PurchaseDetail>
            <ItemsTitle>Items:</ItemsTitle>
            {purchase.cart.map((item, idx) => (
              <PurchaseDetail key={idx}>
                {item.quantity} x {item.name} ({currencySymbol}{convertPrice(parseFloat(item.price), location)})
              </PurchaseDetail>
            ))}
          </PurchaseItem>
        ))
      )}
    </PurchasesContainer>
  );
};

export default PurchasesHistory;
