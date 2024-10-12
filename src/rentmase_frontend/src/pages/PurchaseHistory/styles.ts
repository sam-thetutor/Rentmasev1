import styled from "styled-components";

export const PurchaseItem = styled.div`
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

export const PurchaseTitle = styled.h2`
  font-size: 20px;
  color: #333;
  margin-bottom: 10px;
`;

export const PurchaseDetail = styled.p`
  margin: 5px 0;
  font-size: 16px;
  color: #555;
`;
export const ItemsTitle = styled.h3`
  font-size: 18px;
  color: #333;
  margin-top: 15px;
  margin-bottom: 10px;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 5px;
`;

export const EmptyPurchasesMessage = styled.p`
text-align: center;
font-size: 18px;
color: #888;
margin-top: 20px;
`;