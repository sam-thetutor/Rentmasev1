import { useDispatch, useSelector } from "react-redux";
import { useLazyGetCouuntryGiftCardsQuery } from "../../redux/api/servicesSlice";
import { RootState } from "../../redux/store";
import { useEffect, useState } from "react";
import { setAudience } from "../../redux/slices/app";
import styled from 'styled-components';
import GiftCard from "./Card";
import BuyGift from "./BuyGift";

const CardsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  background-color: white;
  padding: 20px;
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
      {loading ? <div>Loading...</div> : <>{cards?.map((card, index) => (
        <GiftCard key={index} {...card} />
      ))}</>}
    </CardsContainer>
  )
}

export default Gift