import { useState } from "react";
import styled from "styled-components";
import BuyGift from "./BuyGift";

const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
    border: 1px solid #ccc;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  border-radius: 8px;
  margin: 10px;
  flex-direction: column;
  justify-content: center;
  background-color: white;
  padding: 20px;
`;

const Card = styled.div`
  width: 300px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  overflow: hidden;
`;

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const GiftName = styled.p`
  font-size: 16px;
  font-weight: bold;
`;


const GiftCard = (card) => {
    const [openModal, setOpenModal] = useState(false);
    return (
       <>
        <CardContainer onClick={() => setOpenModal(true)}
        >
            <Card>
                <CardImage src={card.logoUrls[0]} alt={card.name} />
            </Card>
            <GiftName>{card.productName}</GiftName>
        </CardContainer>
        {openModal && <BuyGift {...{card, setOpenModal}} />}
       </>
    )
}

export default GiftCard