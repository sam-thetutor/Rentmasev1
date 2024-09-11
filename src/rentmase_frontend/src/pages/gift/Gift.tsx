import { useDispatch, useSelector } from "react-redux";
import { useLazyGetCouuntryGiftCardsQuery } from "../../redux/api/servicesSlice";
import { RootState } from "../../redux/store";
import { useEffect, useState } from "react";
import { setAudience } from "../../redux/slices/app";
import styled from 'styled-components';

const CardsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  background-color: white;
  padding: 20px;
`;

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

const Gift = () => {
  const { location } = useSelector((state: RootState) => state.app);
  const [fetchCards] = useLazyGetCouuntryGiftCardsQuery();
  const [cards, setCards] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);

  const dispacth = useDispatch();

  useEffect(() => {
    dispacth(setAudience("giftcards-sandbox"));
  }, [dispacth]);

  useEffect(() => {
    if (location) {
      setLoading(true);
      fetchCards({ countryCode: location.isoName }).unwrap().then((res) => {
        setCards(res);
        setLoading(false);
      })
        .catch((error) => {
          setLoading(false);
          console.error("Error fetching gift cards: ", error);
        });
    }
  }, [location]);


  return (
    <CardsContainer>
      {loading ? <div>Loading...</div> : <>{cards?.map(card => (
        <CardContainer key={card.id}>
          <Card>
            <CardImage src={card.logoUrls[0]} alt={card.name} />
          </Card>
          <GiftName>{card.productName}</GiftName>
        </CardContainer>
      ))}</>}
    </CardsContainer>
  )
}

export default Gift