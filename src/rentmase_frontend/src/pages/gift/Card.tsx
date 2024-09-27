import { useState } from "react";
import styled from "styled-components";
import BuyGift from "./BuyGift";

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: white;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  margin: 10px;
  cursor: pointer;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  width: 280px;  /* Fixed width for uniformity */
  height: 250px;  /* Fixed height for uniformity */
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.15);
  }
`;

const Card = styled.div`
  width: 100%; /* Full width of the card */
  height: 160px; /* Adjusted height for the image area */
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
`;

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;  /* Ensure image fits inside the card without distortion */
`;

const GiftName = styled.p`
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  color: #333;
  margin-top: 10px;
`;

const GiftCard = (card) => {
  const [openModal, setOpenModal] = useState(false);
  
  return (
    <>
      <CardContainer onClick={() => setOpenModal(true)}>
        <Card>
          <CardImage src={card.logoUrls[0]} alt={card.name} />
        </Card>
        <GiftName>{card.productName}</GiftName>
      </CardContainer>
      
      {openModal && <BuyGift {...{card, setOpenModal}} />}
    </>
  );
};

export default GiftCard;
