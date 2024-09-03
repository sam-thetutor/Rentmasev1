import { useDispatch, useSelector } from "react-redux";
import { useLazyGetCouuntryGiftCardsQuery } from "../../redux/api/servicesSlice";
import { RootState } from "../../redux/store";
import { useEffect, useState } from "react";
import styled from 'styled-components';
import GiftCard from "./Card";
import { getAccessToken } from "../../hooks/requests";
import { giftcards_audience } from "../../constants";
import Geolocation from "../airtime/Geolocation";

const CardsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  background-color: transparent;
  padding: 40px;
  gap: 20px; /* Spacing between cards */
`;

const LoadingMessage = styled.div`
  font-size: 18px;
  color: #008DD5;
  margin: 20px;
`;

const Gift = () => {
  const { location } = useSelector((state: RootState) => state.app);
  const [fetchCards] = useLazyGetCouuntryGiftCardsQuery();
  const [cards, setCards] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await getAccessToken(giftcards_audience);
      if (res) {
        getCards();
      } else {
        setLoading(false);
      }
    })();
  }, [dispatch, location]);

  const getCards = async () => {
    if (location) {
      fetchCards({ countryCode: location.isoName }).unwrap().then((res) => {
        setCards(res);
        setLoading(false);
      })
        .catch((error) => {
          setLoading(false);
          console.error("Error fetching gift cards: ", error);
        });
    } else  {
      setLoading(false);
    }
  }

  return (
   <>
   {!location ? <Geolocation /> :    <CardsContainer>
      {loading ? <LoadingMessage>Loading...</LoadingMessage> : 
        cards?.map((card, index) => (
          <GiftCard key={index} {...card} />
        ))
      }
    </CardsContainer> }
  
   </>
  )
}

export default Gift;
